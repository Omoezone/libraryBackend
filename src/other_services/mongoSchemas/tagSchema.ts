import express from 'express';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const tagSchema = new Schema({
    title: { type: String, required: true },
    tag_description: { type: String }
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;