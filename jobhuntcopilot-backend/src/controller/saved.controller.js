const SavedJob = require('../models/savedJob');
const Job = require('../models/job');

// 临时：没有用户系统时写死一个 demo 用户
function getUserId(req) {
  // TODO: 有登录后，从 req.user.id 里取
  return 'demo-user';
}

// GET /api/saved-jobs  -> 返回当前用户收藏的 jobId 列表
async function listSaved(req, res, next) {
  try {
    const userId = getUserId(req);
    const rows = await SavedJob.find({ userId }).select('jobId -_id');
    res.json(rows.map(r => r.jobId));
  } catch (err) { next(err); }
}

// POST /api/saved-jobs { jobId } -> 新增收藏
async function addSaved(req, res, next) {
  try {
    const userId = getUserId(req);
    const { jobId } = req.body || {};
    if (!jobId) return res.status(400).json({ message: 'jobId required' });

    await SavedJob.updateOne(
      { userId, jobId },
      { $setOnInsert: { userId, jobId } },
      { upsert: true }
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    // 处理重复等
    if (err.code === 11000) return res.status(201).json({ ok: true });
    next(err);
  }
}

// DELETE /api/saved-jobs/:jobId -> 取消收藏
async function removeSaved(req, res, next) {
  try {
    const userId = getUserId(req);
    const { jobId } = req.params;
    await SavedJob.deleteOne({ userId, jobId });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { listSaved, addSaved, removeSaved };
