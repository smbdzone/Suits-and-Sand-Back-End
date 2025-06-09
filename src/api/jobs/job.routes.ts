import express from 'express';
import { 
  getJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  getJobById 
} from './job.controller';

const router = express.Router();

router.get('/', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);

export default router;
