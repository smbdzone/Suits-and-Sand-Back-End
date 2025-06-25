import express from 'express';
import { 
  getJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  getJobById,
  getJobTitles
} from './job.controller';

const router = express.Router();

router.get('/', getJobs);
router.post('/', createJob);
router.get('/positions', getJobTitles); 
router.put('/:id', updateJob);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);

export default router;
