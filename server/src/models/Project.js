import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    key: {
      type: String,
      required: [true, 'Project key is required'],
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Web Application',
        'Cloud Infrastructure',
        'Microservices',
        'Mobile App',
        'Data & AI',
        'DevOps Pipeline',
      ],
      default: 'Web Application',
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Testing', 'Deployed', 'On Hold', 'Completed'],
      default: 'Planning',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    gitHubRepo: {
      type: String,
      trim: true,
      default: '',
    },
    gitHubBranch: {
      type: String,
      default: 'main',
      trim: true,
    },
    techStack: {
      type: [String],
      default: ['React', 'Node.js', 'Docker'],
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100%'],
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: {
      type: Date,
    },
    teamLead: {
      type: String,
      default: 'Project Manager',
      trim: true,
    },
    ciCdConfig: {
      pipelineStatus: {
        type: String,
        enum: ['Idle', 'Running', 'Passed', 'Failed'],
        default: 'Idle',
      },
      lastBuildTime: {
        type: Date,
      },
      buildCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index on key and status for fast queries
projectSchema.index({ key: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
