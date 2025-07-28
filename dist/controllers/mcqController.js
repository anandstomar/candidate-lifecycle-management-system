import MCQ from '../models/MCQ.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GoogleGenAI } from "@google/genai";
import { getRolePrompt, getAvailableRoles, getAvailableDifficulties } from '../utils/rolePrompts.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyDa4ThTgm1uJGjwGsRsIuQG1lvv2p89gsA");
if(genAI) console.log('Gemini AI initialized successfully');

// Get all MCQs
export const getAllMCQs = async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    res.json({ success: true, data: mcqs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get available roles for MCQ generation
export const getRoles = async (req, res) => {
  try {
    const roles = getAvailableRoles();
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get available difficulty levels
export const getDifficulties = async (req, res) => {
  try {
    const difficulties = getAvailableDifficulties();
    res.json({ success: true, data: difficulties });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Generate MCQs using Gemini AI
export const generateMCQs = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { role, count, difficulty } = req.body;
    
    console.log('Extracted values:', { role, count, difficulty });
    
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    // if (!process.env.GEMINI_API_KEY) {
    //   return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    // }

    let model;
    let result;
    let response;
    let text;
    const modelNames = ["gemini-2.5-flash"];
    let totalRequested = parseInt(count) || 5;
    let allMcqs = [];
    let rawResponses = [];
    let retryLimit = 5; // avoid infinite loops
    let attempts = 0;
    let duplicatesSkipped = 0;
    let invalidMCQs = [];
    let savedMCQs = [];
    let debugParsedCount = 0;
    let groupId = uuidv4();

    while (allMcqs.length < totalRequested && attempts < retryLimit) {
      let needed = totalRequested - allMcqs.length;
      let prompt = getRolePrompt(role, needed, difficulty);
      let localText = '';
      for (const modelName of modelNames) {
        try {
          console.log(`Trying model: ${modelName}`);
          model = genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(prompt);
          response = await result.response;
          localText = await response.text();
          rawResponses.push(localText);
          console.log(`Successfully used model: ${modelName}`);
          break;
        } catch (modelError) {
          console.log(`Model ${modelName} failed:`, modelError.message);
          if (modelName === modelNames[modelNames.length - 1]) {
            throw modelError;
          }
          continue;
        }
      }
      // Extract JSON from the response
      let mcqData;
      try {
        const jsonMatch = localText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          mcqData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to parse AI response',
          rawResponse: localText 
        });
      }
      debugParsedCount += mcqData.length;
      // Deduplicate by question text
      for (const mcqItem of mcqData) {
        if (!allMcqs.find(m => m.question === mcqItem.question)) {
          allMcqs.push(mcqItem);
        } else {
          duplicatesSkipped++;
        }
      }
      attempts++;
    }

    // Validate and save MCQs
    for (const mcqItem of allMcqs.slice(0, totalRequested)) {
      try {
        if (!mcqItem.question || !mcqItem.options || mcqItem.correctOption === undefined || !mcqItem.category) {
          console.log('Invalid MCQ item:', mcqItem);
          invalidMCQs.push(mcqItem);
          continue;
        }
        const correctOption = parseInt(mcqItem.correctOption);
        if (isNaN(correctOption) || correctOption < 0 || correctOption >= mcqItem.options.length)  {
          console.log('Invalid correctOption:', mcqItem.correctOption, 'for options length:', mcqItem.options.length);
          invalidMCQs.push(mcqItem);
          continue;
        }
        const existingMCQ = await MCQ.findOne({ 
          question: mcqItem.question
        });
        if (!existingMCQ) {
          const mcq = new MCQ({
            question: mcqItem.question,
            options: mcqItem.options,
            correctOption: correctOption,
            explanation: mcqItem.explanation || '',
            category: mcqItem.category,
            source: 'gemini',
            groupId
          });
          await mcq.save();
          savedMCQs.push(mcq);
          console.log('Successfully saved MCQ:', mcqItem.question.substring(0, 50) + '...');
        } else {
          console.log('Duplicate MCQ skipped:', mcqItem.question.substring(0, 50) + '...');
        }
      } catch (saveError) {
        console.error('Error saving MCQ:', saveError);
        invalidMCQs.push(mcqItem);
      }
    }

    res.json({ 
      success: true, 
      message: `Generated ${savedMCQs.length} new MCQs for ${role}`,
      data: savedMCQs,
      groupId,
      totalGenerated: allMcqs.length,
      requested: totalRequested,
      duplicatesSkipped,
      invalidMCQs: invalidMCQs.length,
      debug: {
        rawResponses: rawResponses.map(r => r.substring(0, 500)),
        parsedData: debugParsedCount
      }
    });

  } catch (err) {
    console.error('Error generating MCQs:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate MCQs',
      error: err.message 
    });
  }
};

// Add a new MCQ
export const addMCQ = async (req, res) => {
  try {
    const { question, options, correctOption, explanation, category, groupId } = req.body;
    if (!question || !options || typeof correctOption !== 'number' || !category) {
      return res.status(400).json({ success: false, message: 'Question, options, correctOption, and category are required' });
    }
    // Check for duplicate MCQ (same question and category)
    const existingMCQ = await MCQ.findOne({ question, category });
    if (existingMCQ) {
      return res.status(400).json({ success: false, message: 'An MCQ with the same question and category already exists' });
    }
    const finalGroupId = groupId || uuidv4();
    const mcq = new MCQ({ question, options, correctOption, explanation, category, source: 'manual', groupId: finalGroupId });
    await mcq.save();
    res.status(201).json({ success: true, data: mcq, groupId: finalGroupId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Edit an MCQ
export const editMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctOption, explanation, category } = req.body;

    const mcq = await MCQ.findById(id);
    if (!mcq) {
      return res.status(404).json({ success: false, message: 'MCQ not found' });
    }

    // Update fields only if provided
    if (question !== undefined) mcq.question = question;
    if (options !== undefined) mcq.options = options;
    if (correctOption !== undefined) mcq.correctOption = correctOption;
    if (explanation !== undefined) mcq.explanation = explanation;
    if (category !== undefined) mcq.category = category;

    // Now save with full validation (schema validation works here)
    await mcq.save();

    res.json({ success: true, data: mcq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Delete an MCQ
export const deleteMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const mcq = await MCQ.findByIdAndDelete(id);
    if (!mcq) {
      return res.status(404).json({ success: false, message: 'MCQ not found' });
    }
    res.json({ success: true, message: 'MCQ deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 

// Fetch MCQs by groupId
export const getMCQsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      return res.status(400).json({ success: false, message: 'groupId is required' });
    }
    const mcqs = await MCQ.find({ groupId });
    res.json({ success: true, data: mcqs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 