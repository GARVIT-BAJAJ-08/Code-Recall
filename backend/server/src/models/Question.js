import mongoose from 'mongoose'

const historySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    outcome: { type: String, enum: ['easy', 'difficult', 'failed', 'saw_solution'], required: true },
  },
  { _id: false }
)

const questionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    problemNumber: { type: Number, min: 0, default: null },
    link: { type: String, trim: true, maxlength: 2000, default: '' },
    topic: { type: String, required: true, trim: true, maxlength: 80 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    notes: { type: String, trim: true, maxlength: 10000, default: '' },
    lastRevised: { type: Date, default: null },
    nextRevision: { type: Date, default: Date.now },
    interval: { type: Number, default: 0, min: 0 },
    easeFactor: { type: Number, default: 2.5, min: 1.3, max: 2.8 },
    reviewCount: { type: Number, default: 0, min: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

questionSchema.virtual('id').get(function getId() {
  return this._id.toHexString()
})

export const Question = mongoose.model('Question', questionSchema)
