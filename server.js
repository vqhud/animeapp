import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from 'mssql';

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';

/* global process */
dotenv.config();

const app = express();
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos',]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          facebookId: profile.id,
          email: null,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value || null,
          provider: 'facebook'
        };

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

app.use(passport.initialize());
const PORT = Number(process.env.PORT || process.env.API_PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, 'src', 'data', 'users.json');
let localUsersCache = null;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  connectionTimeout: 5000,
  requestTimeout: 8000
};

let sqlPool = null;
let sqlStatus = process.env.DB_DATABASE ? 'connecting' : 'not-configured';

const isSqlReady = () => Boolean(sqlPool?.connected);

const initSqlTables = async (pool) => {
  await pool.request().batch(`
    IF OBJECT_ID('dbo.AppUsers', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.AppUsers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fullName NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        phone NVARCHAR(50) NULL,
        birthday NVARCHAR(50) NULL,
        gender NVARCHAR(50) NULL,
        passwordHash NVARCHAR(255) NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.UserProfiles', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.UserProfiles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        updated BIT NOT NULL DEFAULT 0,
        fullName NVARCHAR(255) NULL,
        email NVARCHAR(255) NULL,
        phone NVARCHAR(50) NULL,
        birthday NVARCHAR(50) NULL,
        gender NVARCHAR(50) NULL,
        avatar NVARCHAR(MAX) NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.FeedbackMessages', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.FeedbackMessages (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId NVARCHAR(80) NULL,
        feedbackType NVARCHAR(80) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.NewsArticles', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.NewsArticles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        content NVARCHAR(MAX) NOT NULL, -- Đây là chỗ chứa hàng ngàn chữ của bài báo nè
        tag NVARCHAR(100) DEFAULT 'Tin Tức',
        time NVARCHAR(50) DEFAULT 'Vừa xong',
        views NVARCHAR(50) DEFAULT '0 lượt xem',
        img NVARCHAR(MAX) NULL,
        createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AnimeComments', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.AnimeComments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        AnimeTitle NVARCHAR(255) NOT NULL,
        UserId NVARCHAR(100) NULL,
        UserName NVARCHAR(255) NOT NULL DEFAULT N'Người dùng',
        Avatar NVARCHAR(MAX) NULL,
        Content NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF COL_LENGTH('dbo.AppUsers', 'createdAt') IS NULL
      ALTER TABLE dbo.AppUsers ADD createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.AppUsers', 'updatedAt') IS NULL
      ALTER TABLE dbo.AppUsers ADD updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.UserProfiles', 'createdAt') IS NULL
      ALTER TABLE dbo.UserProfiles ADD createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.UserProfiles', 'updatedAt') IS NULL
      ALTER TABLE dbo.UserProfiles ADD updatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.FeedbackMessages', 'createdAt') IS NULL
      ALTER TABLE dbo.FeedbackMessages ADD createdAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();

    IF COL_LENGTH('dbo.AnimeComments', 'ParentId') IS NULL
      ALTER TABLE dbo.AnimeComments ADD ParentId INT NULL;

    IF OBJECT_ID('dbo.CommentReactions', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.CommentReactions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CommentId INT NOT NULL,
        UserId NVARCHAR(100) NOT NULL,
        Emoji NVARCHAR(10) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_CommentReaction UNIQUE (CommentId, UserId)
      );
    END;
  `);
};

const connectSqlServer = async () => {
  if (!process.env.DB_DATABASE) {
    sqlStatus = 'not-configured';
    return;
  }

  try {
    const pool = await sql.connect(sqlConfig);
    await initSqlTables(pool);
    sqlPool = pool;
    sqlStatus = 'connected';
    console.log(`SQL Server connected: ${sqlConfig.server}:${sqlConfig.port}/${sqlConfig.database}`);
  } catch (error) {
    sqlPool = null;
    sqlStatus = `error: ${error.message}`;
    console.error('SQL Server unavailable, falling back to MongoDB/local JSON:', error.message);
  }
};

mongoose.set('bufferCommands', false);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hhtq_anime';
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB unavailable, local JSON fallback remains available:', error.message));

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    birthday: { type: String, default: '' },
    gender: { type: String, default: '' },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    updated: { type: Boolean, default: false },
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    birthday: { type: String, default: '' },
    gender: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

profileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

const UserProfile = mongoose.model('UserProfile', profileSchema);

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    feedbackType: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

feedbackSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const commentSchema = new mongoose.Schema(
  {
    animeTitle: { type: String, required: true },
    userId: { type: String, default: null },
    userName: { type: String, default: 'Nguoi dung' },
    avatar: { type: String, default: '' },
    content: { type: String, required: true },
    parentId: { type: String, default: null },
    reactions: [{ userId: { type: String, required: true }, emoji: { type: String, required: true } }]
  },
  { timestamps: true }
);

// --- KHUNG DỮ LIỆU TIN TỨC CHO MONGODB ---
const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    tag: { type: String, default: 'Tin Tức' },
    time: { type: String, default: 'Vừa xong' },
    views: { type: String, default: '0 lượt xem' },
    img: { type: String, default: '' }
  },
  { timestamps: true }
);

newsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
  }
});

const News = mongoose.model('News', newsSchema);

commentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
  }
});

const Comment = mongoose.model('Comment', commentSchema);

const localCommentsCache = [];

const isMongoReady = () => mongoose.connection.readyState === 1;

const publicUser = (user) => {
  const nextUser = { ...user };
  delete nextUser.password;
  delete nextUser.passwordHash;
  return nextUser;
};

const profileFromUser = (user) => ({
  userId: String(user.id),
  updated: Boolean(user.fullName),
  fullName: user.fullName || '',
  email: user.email || '',
  phone: user.phone || '',
  birthday: user.birthday || '',
  gender: user.gender || '',
  avatar: user.avatar || ''
});

const getColumn = (row, ...names) => names.map((name) => row?.[name]).find((value) => value !== undefined && value !== null);

const mapSqlUser = (row) =>
  row
    ? {
      id: String(getColumn(row, 'id', 'Id', 'ID')),
      fullName: getColumn(row, 'fullName', 'FullName', 'name', 'Name') || '',
      email: getColumn(row, 'email', 'Email') || '',
      phone: getColumn(row, 'phone', 'Phone') || '',
      birthday: getColumn(row, 'birthday', 'Birthday') || '',
      gender: getColumn(row, 'gender', 'Gender') || '',
      passwordHash: getColumn(row, 'passwordHash', 'PasswordHash', 'password', 'Password') || ''
    }
    : null;

const mapSqlProfile = (row, user) =>
  row
    ? {
      userId: String(getColumn(row, 'userId', 'UserId', 'UserID')),
      updated: Boolean(getColumn(row, 'updated', 'Updated')),
      fullName: getColumn(row, 'fullName', 'FullName') || '',
      email: getColumn(row, 'email', 'Email') || '',
      phone: getColumn(row, 'phone', 'Phone') || '',
      birthday: getColumn(row, 'birthday', 'Birthday') || '',
      gender: getColumn(row, 'gender', 'Gender') || '',
      avatar: getColumn(row, 'avatar', 'Avatar') || ''
    }
    : profileFromUser(user);

const findSqlUserByEmail = async (email) => {
  const result = await sqlPool
    .request()
    .input('email', sql.NVarChar(255), email)
    .query('SELECT TOP 1 * FROM dbo.AppUsers WHERE email = @email');

  return mapSqlUser(result.recordset[0]);
};

const findSqlUserById = async (userId) => {
  const result = await sqlPool
    .request()
    .input('id', sql.Int, Number(userId))
    .query('SELECT TOP 1 * FROM dbo.AppUsers WHERE id = @id');

  return mapSqlUser(result.recordset[0]);
};

const getSqlProfile = async (user) => {
  const result = await sqlPool
    .request()
    .input('userId', sql.Int, Number(user.id))
    .query('SELECT TOP 1 * FROM dbo.UserProfiles WHERE userId = @userId');

  return mapSqlProfile(result.recordset[0], user);
};

const createSqlUser = async ({ fullName, email, phone, birthday, gender, password }) => {
  const result = await sqlPool
    .request()
    .input('fullName', sql.NVarChar(255), fullName)
    .input('email', sql.NVarChar(255), email)
    .input('phone', sql.NVarChar(50), phone || '')
    .input('birthday', sql.NVarChar(50), birthday || '')
    .input('gender', sql.NVarChar(50), gender || '')
    .input('passwordHash', sql.NVarChar(255), password)
    .query(`
      INSERT INTO dbo.AppUsers (fullName, email, phone, birthday, gender, passwordHash)
      OUTPUT INSERTED.*
      VALUES (@fullName, @email, @phone, @birthday, @gender, @passwordHash)
    `);

  const user = mapSqlUser(result.recordset[0]);

  await sqlPool
    .request()
    .input('userId', sql.Int, Number(user.id))
    .input('fullName', sql.NVarChar(255), user.fullName)
    .input('email', sql.NVarChar(255), user.email)
    .input('phone', sql.NVarChar(50), user.phone)
    .input('birthday', sql.NVarChar(50), user.birthday)
    .input('gender', sql.NVarChar(50), user.gender)
    .query(`
      INSERT INTO dbo.UserProfiles (userId, fullName, email, phone, birthday, gender, updated)
      VALUES (@userId, @fullName, @email, @phone, @birthday, @gender, 1)
    `);

  return user;
};

const syncSqlUserPassword = async (user, password) => {
  if (!isSqlReady() || !user?.id) return;

  await sqlPool
    .request()
    .input('id', sql.Int, Number(user.id))
    .input('passwordHash', sql.NVarChar(255), password)
    .query(`
      UPDATE dbo.AppUsers
      SET passwordHash = @passwordHash, updatedAt = SYSUTCDATETIME()
      WHERE id = @id
    `);
};

const ensureSqlUserFromLegacy = async (legacyUser, password) => {
  if (!isSqlReady() || !legacyUser) return null;

  const normalizedEmail = normalizeEmail(legacyUser.email);
  const existingUser = await findSqlUserByEmail(normalizedEmail);

  if (existingUser) {
    await syncSqlUserPassword(existingUser, password);
    return {
      ...existingUser,
      passwordHash: password
    };
  }

  return createSqlUser({
    fullName: legacyUser.fullName || legacyUser.name || normalizedEmail,
    email: normalizedEmail,
    phone: legacyUser.phone || '',
    birthday: legacyUser.birthday || '',
    gender: legacyUser.gender || '',
    password
  });
};

const updateSqlProfile = async (userId, payload) => {
  const user = await findSqlUserById(userId);
  if (!user) return null;

  const nextUser = {
    ...user,
    fullName: payload.fullName || '',
    email: normalizeEmail(payload.email),
    phone: payload.phone || '',
    birthday: payload.birthday || '',
    gender: payload.gender || '',
    avatar: payload.avatar || ''
  };

  await sqlPool
    .request()
    .input('id', sql.Int, Number(userId))
    .input('fullName', sql.NVarChar(255), nextUser.fullName)
    .input('email', sql.NVarChar(255), nextUser.email)
    .input('phone', sql.NVarChar(50), nextUser.phone)
    .input('birthday', sql.NVarChar(50), nextUser.birthday)
    .input('gender', sql.NVarChar(50), nextUser.gender)
    .query(`
      UPDATE dbo.AppUsers
      SET fullName = @fullName, email = @email, phone = @phone, birthday = @birthday, gender = @gender, updatedAt = SYSUTCDATETIME()
      WHERE id = @id
    `);

  await sqlPool
    .request()
    .input('userId', sql.Int, Number(userId))
    .input('fullName', sql.NVarChar(255), nextUser.fullName)
    .input('email', sql.NVarChar(255), nextUser.email)
    .input('phone', sql.NVarChar(50), nextUser.phone)
    .input('birthday', sql.NVarChar(50), nextUser.birthday)
    .input('gender', sql.NVarChar(50), nextUser.gender)
    .input('avatar', sql.NVarChar(sql.MAX), nextUser.avatar)
    .query(`
      MERGE dbo.UserProfiles AS target
      USING (SELECT @userId AS userId) AS source
      ON target.userId = source.userId
      WHEN MATCHED THEN
        UPDATE SET updated = 1, fullName = @fullName, email = @email, phone = @phone, birthday = @birthday, gender = @gender, avatar = @avatar, updatedAt = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (userId, updated, fullName, email, phone, birthday, gender, avatar)
        VALUES (@userId, 1, @fullName, @email, @phone, @birthday, @gender, @avatar);
    `);

  return {
    user: publicUser(nextUser),
    profile: await getSqlProfile(nextUser)
  };
};

const readLocalUsers = async () => {
  if (localUsersCache) return localUsersCache;

  try {
    const content = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(content);
    localUsersCache = Array.isArray(users) ? users : [];
  } catch {
    localUsersCache = [];
  }

  return localUsersCache;
};

const writeLocalUsers = async (users) => {
  localUsersCache = users;

  try {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
  } catch (error) {
    if (['EROFS', 'EACCES', 'EPERM'].includes(error.code)) {
      console.warn('Local users file is read-only; using in-memory fallback:', error.message);
      return;
    }

    throw error;
  }
};

const findLocalUserByEmail = async (email) => {
  const users = await readLocalUsers();
  return users.find((user) => normalizeEmail(user.email) === email) || null;
};

const findLocalUserById = async (userId) => {
  const users = await readLocalUsers();
  return users.find((user) => String(user.id) === String(userId)) || null;
};

const getLocalPassword = (user) => user?.passwordHash || user?.password || '';

const createLocalUser = async ({ fullName, email, phone, birthday, gender, password }) => {
  const users = await readLocalUsers();
  const newUser = {
    id: String(Date.now()),
    fullName,
    email,
    phone: phone || '',
    birthday: birthday || '',
    gender: gender || '',
    password,
    passwordHash: password
  };

  await writeLocalUsers([...users, newUser]);
  return newUser;
};

const updateLocalProfile = async (userId, payload) => {
  const users = await readLocalUsers();
  const index = users.findIndex((user) => String(user.id) === String(userId));

  const updatedFields = {
    fullName: payload.fullName || '',
    email: normalizeEmail(payload.email || ''),
    phone: payload.phone || '',
    birthday: payload.birthday || '',
    gender: payload.gender || '',
    avatar: payload.avatar || ''
  };

  if (index < 0) {
    const newUser = { id: String(userId), ...updatedFields, password: '', passwordHash: '' };
    await writeLocalUsers([...users, newUser]);
    const user = publicUser(newUser);
    return { user, profile: profileFromUser(user) };
  }

  users[index] = { ...users[index], ...updatedFields };
  await writeLocalUsers(users);
  const user = publicUser(users[index]);
  return { user, profile: profileFromUser(user) };
};

app.get('/', (req, res) => {
  res.json({
    ok: true,
    name: 'HHTQ API',
    port: PORT,
    database: isSqlReady() ? 'sql-server' : isMongoReady() ? 'mongodb' : 'local-json-fallback',
    sqlStatus,
    frontend: 'Open the Vite URL, for example http://127.0.0.1:5177',
    endpoints: ['/api/test-db', '/api/auth/login', '/api/auth/register']
  });
});

app.get('/api/test-db', (req, res) => {
  const mongoStatus = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.json({
    ok: true,
    activeDatabase: isSqlReady() ? 'sql-server' : isMongoReady() ? 'mongodb' : 'local-json-fallback',
    sql: {
      status: sqlStatus,
      server: sqlConfig.server,
      database: sqlConfig.database,
      port: sqlConfig.port
    },
    mongo: {
      status: mongoStatus[mongoose.connection.readyState] || 'Unknown'
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, birthday, gender, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!fullName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc.' });
    }

    if (isSqlReady()) {
      const existingUser = await findSqlUserByEmail(normalizedEmail);
      if (existingUser) return res.status(409).json({ message: 'Email đã được đăng ký.' });

      const user = await createSqlUser({ fullName, email: normalizedEmail, phone, birthday, gender, password });
      return res.status(201).json({ user: publicUser(user), profile: await getSqlProfile(user), source: 'sql-server' });
    }

    if (isMongoReady()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) return res.status(409).json({ message: 'Email đã được đăng ký.' });

      const newUser = await User.create({
        fullName,
        email: normalizedEmail,
        phone: phone || '',
        birthday: birthday || '',
        gender: gender || '',
        passwordHash: password
      });

      const profile = await UserProfile.create({
        userId: newUser._id,
        updated: true,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone || '',
        birthday: newUser.birthday || '',
        gender: newUser.gender || '',
        avatar: ''
      });

      return res.status(201).json({ user: newUser, profile, source: 'mongodb' });
    }

    const existingLocalUser = await findLocalUserByEmail(normalizedEmail);
    if (existingLocalUser) return res.status(409).json({ message: 'Email đã được đăng ký.' });

    const localUser = await createLocalUser({ fullName, email: normalizedEmail, phone, birthday, gender, password });
    const user = publicUser(localUser);
    return res.status(201).json({ user, profile: profileFromUser(user), source: 'local-json-fallback' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Không thể đăng ký tài khoản.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    if (isSqlReady()) {
      const user = await findSqlUserByEmail(normalizedEmail);
      if (user && user.passwordHash === password) {
        return res.json({ user: publicUser(user), profile: await getSqlProfile(user), source: 'sql-server' });
      }
    }

    if (isMongoReady()) {
      const user = await User.findOne({ email: normalizedEmail });

      if (user && user.passwordHash === password) {
        const syncedUser = await ensureSqlUserFromLegacy(user, password);
        if (syncedUser) {
          return res.json({
            user: publicUser(syncedUser),
            profile: await getSqlProfile(syncedUser),
            source: 'sql-server-synced-from-mongodb'
          });
        }

        let profile = await UserProfile.findOne({ userId: user._id });
        if (!profile) {
          profile = await UserProfile.create({ userId: user._id, email: user.email, fullName: user.fullName });
        }

        return res.json({ user, profile, source: 'mongodb' });
      }
    }

    const localUser = await findLocalUserByEmail(normalizedEmail);
    if (!localUser) return res.status(404).json({ message: 'Email không tồn tại.' });
    if (getLocalPassword(localUser) !== password) return res.status(401).json({ message: 'Mật khẩu không đúng.' });

    const syncedUser = await ensureSqlUserFromLegacy(localUser, password);
    if (syncedUser) {
      return res.json({
        user: publicUser(syncedUser),
        profile: await getSqlProfile(syncedUser),
        source: 'sql-server-synced-from-local'
      });
    }

    const user = publicUser(localUser);
    return res.json({ user, profile: profileFromUser(user), source: 'local-json-fallback' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Không thể đăng nhập.', error: error.message });
  }
});
app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    if (isSqlReady() && /^\d+$/.test(String(req.params.userId))) {
      const user = await findSqlUserById(req.params.userId);
      if (user) return res.json({ profile: await getSqlProfile(user), source: 'sql-server' });
    }

    if (isMongoReady() && /^[0-9a-f]{24}$/i.test(String(req.params.userId))) {
      const profile = await UserProfile.findOne({ userId: req.params.userId });
      if (profile) return res.json({ profile, source: 'mongodb' });
    }

    const localUser = await findLocalUserById(req.params.userId);
    if (!localUser) return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });

    const user = publicUser(localUser);
    return res.json({ profile: profileFromUser(user), source: 'local-json-fallback' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải hồ sơ.', error: error.message });
  }
});

app.put('/api/users/:userId/profile', async (req, res) => {
  const { userId } = req.params;
  let lastError = null;

  if (isSqlReady() && /^\d+$/.test(String(userId))) {
    try {
      const result = await updateSqlProfile(userId, req.body);
      if (result) return res.json({ ...result, source: 'sql-server' });
    } catch (err) {
      console.error('SQL profile update failed:', err.message);
      lastError = err;
    }
  }

  if (isMongoReady() && /^[0-9a-f]{24}$/i.test(String(userId))) {
    try {
      const { fullName, email, phone, birthday, gender, avatar } = req.body;
      const normalizedEmail = normalizeEmail(email);
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { userId },
        { fullName, email: normalizedEmail, phone, birthday, gender, avatar, updated: true },
        { new: true, upsert: true }
      );
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, email: normalizedEmail, phone, birthday, gender },
        { new: true }
      );
      if (updatedUser) return res.json({ user: updatedUser, profile: updatedProfile, source: 'mongodb' });
    } catch (err) {
      console.error('MongoDB profile update failed:', err.message);
      lastError = err;
    }
  }

  try {
    const localResult = await updateLocalProfile(userId, req.body);
    if (!localResult) return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });
    return res.json({ ...localResult, source: 'local-json-fallback' });
  } catch (err) {
    console.error('Local profile update failed:', err.message);
    lastError = err;
  }

  return res.status(500).json({ message: 'Không thể cập nhật hồ sơ.', error: lastError?.message });
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { userId, type, content } = req.body;

    if (!content) return res.status(400).json({ message: 'Vui lòng nhập nội dung.' });

    if (isSqlReady()) {
      const result = await sqlPool
        .request()
        .input('userId', sql.NVarChar(80), userId ? String(userId) : null)
        .input('feedbackType', sql.NVarChar(80), type || 'suggest')
        .input('content', sql.NVarChar(sql.MAX), content)
        .query(`
          INSERT INTO dbo.FeedbackMessages (userId, feedbackType, content)
          OUTPUT INSERTED.*
          VALUES (@userId, @feedbackType, @content)
        `);

      return res.status(201).json({ message: 'Đã gửi phản hồi.', feedback: result.recordset[0], source: 'sql-server' });
    }

    if (isMongoReady()) {
      const feedback = await Feedback.create({
        userId: /^[0-9a-f]{24}$/i.test(String(userId)) ? userId : null,
        feedbackType: type || 'suggest',
        content
      });

      return res.status(201).json({ message: 'Đã gửi phản hồi.', feedback, source: 'mongodb' });
    }

    return res.status(201).json({
      message: 'Đã ghi nhận phản hồi.',
      feedback: { id: String(Date.now()), userId: userId || null, feedbackType: type || 'suggest', content },
      source: 'local-json-fallback'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Không thể gửi phản hồi.', error: error.message });
  }
});

await connectSqlServer();

const COMMENT_LIMIT_PER_HOUR = 3;

const mergeReactionsIntoComments = (comments, reactionRows, myReactionRows) => {
  const reactionMap = {};
  for (const row of reactionRows) {
    const cid = String(row.CommentId || row.commentId);
    if (!reactionMap[cid]) reactionMap[cid] = {};
    reactionMap[cid][row.Emoji || row.emoji] = Number(row.cnt || row.count || 0);
  }
  const myMap = {};
  for (const row of myReactionRows) {
    myMap[String(row.CommentId || row.commentId)] = row.Emoji || row.emoji;
  }
  return comments.map((c) => {
    const cid = String(c.id || c._id);
    return { ...c, reactions: reactionMap[cid] || {}, myReaction: myMap[cid] || null };
  });
};

app.get('/api/anime-comments', async (req, res) => {
  try {
    const animeTitle = String(req.query.animeTitle || '').trim();
    const sessionId = String(req.query.sessionId || '').trim();

    if (!animeTitle) return res.status(400).json({ message: 'Thieu ten phim.' });

    if (isSqlReady()) {
      const commentsResult = await sqlPool
        .request()
        .input('AnimeTitle', sql.NVarChar(255), animeTitle)
        .query(`
          SELECT TOP (200)
            Id AS id, AnimeTitle AS animeTitle, UserId AS userId,
            UserName AS userName, Avatar AS avatar, Content AS content,
            ParentId AS parentId, CreatedAt AS createdAt
          FROM dbo.AnimeComments
          WHERE AnimeTitle = @AnimeTitle
          ORDER BY CreatedAt ASC
        `);

      const reactionsResult = await sqlPool
        .request()
        .input('AnimeTitle2', sql.NVarChar(255), animeTitle)
        .query(`
          SELECT r.CommentId, r.Emoji, COUNT(*) AS cnt
          FROM dbo.CommentReactions r
          WHERE r.CommentId IN (SELECT Id FROM dbo.AnimeComments WHERE AnimeTitle = @AnimeTitle2)
          GROUP BY r.CommentId, r.Emoji
        `);

      const myReactionsResult = sessionId
        ? await sqlPool
          .request()
          .input('AnimeTitle3', sql.NVarChar(255), animeTitle)
          .input('SessionId', sql.NVarChar(100), sessionId)
          .query(`
            SELECT r.CommentId, r.Emoji
            FROM dbo.CommentReactions r
            WHERE r.CommentId IN (SELECT Id FROM dbo.AnimeComments WHERE AnimeTitle = @AnimeTitle3)
            AND r.UserId = @SessionId
          `)
        : { recordset: [] };

      const comments = mergeReactionsIntoComments(
        commentsResult.recordset,
        reactionsResult.recordset,
        myReactionsResult.recordset
      );
      return res.json({ comments, source: 'sql-server' });
    }

    if (isMongoReady()) {
      const docs = await Comment.find({ animeTitle }).sort({ createdAt: 1 }).limit(200);
      const comments = docs.map((c) => {
        const plain = c.toJSON();
        const reactions = {};
        for (const r of plain.reactions || []) {
          reactions[r.emoji] = (reactions[r.emoji] || 0) + 1;
        }
        const myReaction = sessionId
          ? (plain.reactions || []).find((r) => r.userId === sessionId)?.emoji || null
          : null;
        return { ...plain, reactions, myReaction };
      });
      return res.json({ comments, source: 'mongodb' });
    }

    const comments = localCommentsCache
      .filter((c) => c.animeTitle === animeTitle)
      .map((c) => {
        const reactions = {};
        for (const r of c.reactions || []) reactions[r.emoji] = (reactions[r.emoji] || 0) + 1;
        const myReaction = sessionId
          ? (c.reactions || []).find((r) => r.userId === sessionId)?.emoji || null
          : null;
        return { ...c, reactions, myReaction };
      });
    return res.json({ comments, source: 'local-memory' });
  } catch (error) {
    console.error('Load comments error:', error);
    return res.status(500).json({ message: 'Khong the tai binh luan.' });
  }
});

app.post('/api/anime-comments', async (req, res) => {
  try {
    const { animeTitle, userId, userName, avatar, content, parentId, sessionId } = req.body;
    const actorId = userId || sessionId || null;

    if (!animeTitle || !content) return res.status(400).json({ message: 'Thieu ten phim hoac noi dung.' });

    if (isSqlReady()) {
      if (actorId) {
        const limitCheck = await sqlPool
          .request()
          .input('AnimeTitle', sql.NVarChar(255), animeTitle)
          .input('ActorId', sql.NVarChar(100), actorId)
          .query(`
            SELECT COUNT(*) AS cnt FROM dbo.AnimeComments
            WHERE AnimeTitle = @AnimeTitle AND UserId = @ActorId
            AND CreatedAt >= DATEADD(HOUR, -1, SYSUTCDATETIME())
          `);
        if ((limitCheck.recordset[0]?.cnt || 0) >= COMMENT_LIMIT_PER_HOUR) {
          return res.status(429).json({ message: 'Ban da dat gioi han 3 binh luan moi gio.' });
        }
      }

      const result = await sqlPool
        .request()
        .input('AnimeTitle', sql.NVarChar(255), animeTitle)
        .input('UserId', sql.NVarChar(100), actorId)
        .input('UserName', sql.NVarChar(255), userName || 'Ban')
        .input('Avatar', sql.NVarChar(sql.MAX), avatar || '')
        .input('Content', sql.NVarChar(sql.MAX), content)
        .input('ParentId', sql.Int, parentId ? Number(parentId) : null)
        .query(`
          INSERT INTO dbo.AnimeComments (AnimeTitle, UserId, UserName, Avatar, Content, ParentId)
          OUTPUT INSERTED.Id AS id, INSERTED.AnimeTitle AS animeTitle,
            INSERTED.UserId AS userId, INSERTED.UserName AS userName,
            INSERTED.Avatar AS avatar, INSERTED.Content AS content,
            INSERTED.ParentId AS parentId, INSERTED.CreatedAt AS createdAt
          VALUES (@AnimeTitle, @UserId, @UserName, @Avatar, @Content, @ParentId)
        `);
      return res.status(201).json({ comment: { ...result.recordset[0], reactions: {}, myReaction: null }, source: 'sql-server' });
    }

    if (isMongoReady()) {
      if (actorId) {
        const count = await Comment.countDocuments({
          animeTitle,
          userId: actorId,
          createdAt: { $gte: new Date(Date.now() - 3600000) }
        });
        if (count >= COMMENT_LIMIT_PER_HOUR) {
          return res.status(429).json({ message: 'Ban da dat gioi han 3 binh luan moi gio.' });
        }
      }
      const comment = await Comment.create({
        animeTitle, userId: actorId, userName: userName || 'Ban',
        avatar: avatar || '', content, parentId: parentId || null, reactions: []
      });
      return res.status(201).json({ comment: { ...comment.toJSON(), reactions: {}, myReaction: null }, source: 'mongodb' });
    }

    if (actorId) {
      const hourAgo = Date.now() - 3600000;
      const count = localCommentsCache.filter(
        (c) => c.animeTitle === animeTitle && c.userId === actorId && new Date(c.createdAt).getTime() > hourAgo
      ).length;
      if (count >= COMMENT_LIMIT_PER_HOUR) {
        return res.status(429).json({ message: 'Ban da dat gioi han 3 binh luan moi gio.' });
      }
    }
    const comment = {
      id: String(Date.now()), animeTitle, userId: actorId,
      userName: userName || 'Ban', avatar: avatar || '', content,
      parentId: parentId || null, reactions: [], createdAt: new Date().toISOString()
    };
    localCommentsCache.unshift(comment);
    return res.status(201).json({ comment: { ...comment, reactions: {}, myReaction: null }, source: 'local-memory' });
  } catch (error) {
    console.error('Create comment error:', error);
    return res.status(500).json({ message: 'Khong the gui binh luan.' });
  }
});

app.put('/api/anime-comments/:id/react', async (req, res) => {
  try {
    const commentId = req.params.id;
    const { emoji, userId, sessionId } = req.body;
    const actorId = userId || sessionId || null;

    if (!emoji || !actorId) return res.status(400).json({ message: 'Thieu emoji hoac userId.' });

    if (isSqlReady()) {
      const existing = await sqlPool
        .request()
        .input('CommentId', sql.Int, Number(commentId))
        .input('UserId', sql.NVarChar(100), actorId)
        .query('SELECT Emoji FROM dbo.CommentReactions WHERE CommentId = @CommentId AND UserId = @UserId');

      const currentEmoji = existing.recordset[0]?.Emoji;

      if (currentEmoji === emoji) {
        await sqlPool.request()
          .input('CommentId', sql.Int, Number(commentId))
          .input('UserId', sql.NVarChar(100), actorId)
          .query('DELETE FROM dbo.CommentReactions WHERE CommentId = @CommentId AND UserId = @UserId');
      } else {
        await sqlPool.request()
          .input('CommentId', sql.Int, Number(commentId))
          .input('UserId', sql.NVarChar(100), actorId)
          .input('Emoji', sql.NVarChar(10), emoji)
          .query(`
            MERGE dbo.CommentReactions AS t
            USING (SELECT @CommentId AS c, @UserId AS u) AS s ON t.CommentId = s.c AND t.UserId = s.u
            WHEN MATCHED THEN UPDATE SET Emoji = @Emoji
            WHEN NOT MATCHED THEN INSERT (CommentId, UserId, Emoji) VALUES (@CommentId, @UserId, @Emoji);
          `);
      }

      const counts = await sqlPool.request()
        .input('CommentId2', sql.Int, Number(commentId))
        .query('SELECT Emoji, COUNT(*) AS cnt FROM dbo.CommentReactions WHERE CommentId = @CommentId2 GROUP BY Emoji');

      const reactions = {};
      for (const row of counts.recordset) reactions[row.Emoji] = row.cnt;
      return res.json({ reactions, myReaction: currentEmoji === emoji ? null : emoji });
    }

    if (isMongoReady()) {
      const doc = await Comment.findById(commentId);
      if (!doc) return res.status(404).json({ message: 'Khong tim thay binh luan.' });

      const idx = doc.reactions.findIndex((r) => r.userId === actorId);
      if (idx >= 0 && doc.reactions[idx].emoji === emoji) {
        doc.reactions.splice(idx, 1);
      } else if (idx >= 0) {
        doc.reactions[idx].emoji = emoji;
      } else {
        doc.reactions.push({ userId: actorId, emoji });
      }
      await doc.save();

      const reactions = {};
      for (const r of doc.reactions) reactions[r.emoji] = (reactions[r.emoji] || 0) + 1;
      const myReaction = doc.reactions.find((r) => r.userId === actorId)?.emoji || null;
      return res.json({ reactions, myReaction });
    }

    const c = localCommentsCache.find((x) => x.id === commentId);
    if (c) {
      if (!c.reactions) c.reactions = [];
      const idx = c.reactions.findIndex((r) => r.userId === actorId);
      if (idx >= 0 && c.reactions[idx].emoji === emoji) {
        c.reactions.splice(idx, 1);
      } else if (idx >= 0) {
        c.reactions[idx].emoji = emoji;
      } else {
        c.reactions.push({ userId: actorId, emoji });
      }
    }
    const target = localCommentsCache.find((x) => x.id === commentId);
    const reactions = {};
    for (const r of (target?.reactions || [])) reactions[r.emoji] = (reactions[r.emoji] || 0) + 1;
    const myReaction = (target?.reactions || []).find((r) => r.userId === actorId)?.emoji || null;
    return res.json({ reactions, myReaction });
  } catch (error) {
    console.error('React comment error:', error);
    return res.status(500).json({ message: 'Khong the phan ung.' });
  }
});



app.get('/api/auth/facebook', (req, res, next) => {
  passport.authenticate('facebook', {
    scope: []
  })(req, res, next);
});
app.get(
  '/api/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook`
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.facebookId,
        email: req.user.email,
        fullName: req.user.fullName,
        avatar: req.user.avatar,
        provider: 'facebook'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
  });
}


app.get('/api/news', async (req, res) => {
  try {
    if (isMongoReady()) {
      const newsList = await News.find().sort({ createdAt: -1 });
      return res.json({ news: newsList, source: 'mongodb' });
    }
    
    if (isSqlReady()) {
      const result = await sqlPool.request().query('SELECT * FROM dbo.NewsArticles ORDER BY createdAt DESC');
      return res.json({ news: result.recordset, source: 'sql-server' });
    }
    
    return res.json({ news: [], source: 'local-json-fallback' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải danh sách tin.', error: error.message });
  }
});


app.get('/api/news/:id', async (req, res) => {
  try {
    const newsId = req.params.id;

    if (isMongoReady() && /^[0-9a-f]{24}$/i.test(newsId)) {
      const article = await News.findById(newsId);
      if (article) return res.json({ article, source: 'mongodb' });
    }

    if (isSqlReady() && /^\d+$/.test(newsId)) {
      const result = await sqlPool.request()
        .input('id', sql.Int, Number(newsId))
        .query('SELECT TOP 1 * FROM dbo.NewsArticles WHERE id = @id');
      if (result.recordset[0]) return res.json({ article: result.recordset[0], source: 'sql-server' });
    }

    return res.status(404).json({ message: 'Không tìm thấy bài báo này.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải bài báo.', error: error.message });
  }
});

export default app;
