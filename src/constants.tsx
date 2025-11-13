
import React from 'react';
import { Tool } from './types';
import * as Icons from '/src/components/icons/toolIcons';

// --- Tool Components ---
import IndomindChat from '/src/components/tools/IndomindChat';
import ImageGenerator from '/src/components/tools/ImageGenerator';
import KnowledgeSummarizer from '/src/components/tools/KnowledgeSummarizer';
import CodeOptimizer from '/src/components/tools/CodeOptimizer';
import WebsiteGenerator from '/src/components/tools/WebsiteGenerator';
import VideoGenerator from '/src/components/tools/VideoGenerator';
import SongGenerator from '/src/components/tools/SongGenerator';
import ThreeDModelGenerator from '/src/components/tools/ThreeDModelGenerator';
import VoiceCloner from '/src/components/tools/VoiceCloner';
import TextToSpeech from '/src/components/tools/TextToSpeech';
import SpeechToText from '/src/components/tools/SpeechToText';
import AutoResearcher from '/src/components/tools/AutoResearcher';
import WebDataSearch from '/src/components/tools/WebDataSearch';
import DocumentReader from '/src/components/tools/DocumentReader';
import AppBuilder from '/src/components/tools/AppBuilder';
import BugFixer from '/src/components/tools/BugFixer';
import StartupIdeaGenerator from '/src/components/tools/StartupIdeaGenerator';
import BusinessPlan from '/src/components/tools/BusinessPlan';
import SeoOptimizer from '/src/components/tools/SeoOptimizer';
import StudentTutor from '/src/components/tools/StudentTutor';
import MathSolver from '/src/components/tools/MathSolver';
import FitnessPlanner from '/src/components/tools/FitnessPlanner';
import DietPlanner from '/src/components/tools/DietPlanner';
import HoroscopeGenerator from '/src/components/tools/HoroscopeGenerator';
import DreamInterpreter from '/src/components/tools/DreamInterpreter';
import NewsSummarizer from '/src/components/tools/NewsSummarizer';
import OcrScanner from '/src/components/tools/OcrScanner';

// Helper for tools that are not yet custom-built but are active
const createTool = (id: string, name: string, description: string, category: string, icon: React.ComponentType<{ className?: string }>, component: React.ComponentType<any>): Tool => ({
  id,
  name,
  description,
  category,
  icon,
  isImplemented: true,
  component,
  enabled: true,
});

// FIX: Export a function to create a placeholder for a new, unimplemented tool.
export const createActivePlaceholder = (
  { id, name, description, category, icon }:
  { id: string; name: string; description: string; category: string; icon: React.ComponentType<{ className?: string }> }
): Tool => ({
  id,
  name,
  description,
  category,
  icon,
  isImplemented: false, // Custom tools are not implemented by default
  component: null, // No component for placeholder
  enabled: true, // Should be enabled by default
});

export const ALL_TOOLS: Tool[] = [
  // --- Chat & Knowledge Tools ---
  createTool('chat', 'Indomind Chat', 'Engage in intelligent conversations with our core AI.', 'Chat & Knowledge', Icons.ChatIcon, IndomindChat),
  createTool('auto_researcher', 'Auto Researcher AI', 'Automated research on any topic.', 'Chat & Knowledge', Icons.SearchIcon, AutoResearcher),
  createTool('web_data_search', 'Real-Time Web Data Search', 'Search the web in real-time for up-to-date info.', 'Chat & Knowledge', Icons.WebSearchIcon, WebDataSearch),
  createTool('summarizer', 'Knowledge Summarizer', 'Condense long texts into concise summaries.', 'Chat & Knowledge', Icons.SummarizeIcon, KnowledgeSummarizer),
  createTool('document_reader', 'Document Reader AI', 'Extract and understand info from documents.', 'Chat & Knowledge', Icons.DocumentIcon, DocumentReader),
  createTool('memory_recall', 'Memory Recall AI', 'Stores and recalls information from your past conversations.', 'Chat & Knowledge', Icons.MemoryIcon, StudentTutor),
  createTool('fact_checker', 'AI Fact Checker', 'Verify information and check facts with AI assistance.', 'Chat & Knowledge', Icons.FactCheckIcon, StudentTutor),
  createTool('debate_generator', 'AI Debate Generator', 'Generate arguments for both sides of a topic.', 'Chat & Knowledge', Icons.DebateIcon, StudentTutor),
  createTool('emotion_simulator', 'Human Emotion Chat Simulator', 'Practice conversations with an AI that simulates emotions.', 'Chat & Knowledge', Icons.EmotionIcon, StudentTutor),
  createTool('brainstorm_partner', 'Brainstorm Partner AI', 'Generate and expand upon creative ideas.', 'Chat & Knowledge', Icons.LightbulbIcon, StartupIdeaGenerator),

  // --- Creative Media Tools ---
  createTool('image_generator', 'Image Generator', 'Create stunning visuals from text descriptions.', 'Creative Media', Icons.ImageIcon, ImageGenerator),
  createTool('3d_model_generator', '3D Model Generator', 'Generate 3D model concepts and specs from text.', 'Creative Media', Icons.ThreeDIcon, ThreeDModelGenerator),
  createTool('art_style_converter', 'Art Style Converter', 'Transform images into different artistic styles.', 'Creative Media', Icons.ArtIcon, ImageGenerator),
  createTool('cartoonizer', 'Cartoonizer', 'Turn your photos into cartoon-style images.', 'Creative Media', Icons.CartoonIcon, ImageGenerator),
  createTool('image_restorer', 'Image Restorer', 'Restore and enhance old or damaged photos.', 'Creative Media', Icons.RestoreIcon, ImageGenerator),
  createTool('sketch_to_photo', 'Sketch to Photo AI', 'Convert simple sketches into realistic photos.', 'Creative Media', Icons.SketchIcon, ImageGenerator),
  createTool('digital_painting', 'Digital Painting Generator', 'Create beautiful digital paintings from a prompt.', 'Creative Media', Icons.PaintingIcon, ImageGenerator),
  createTool('poster_banner_maker', 'Poster & Banner Maker', 'Design marketing materials with AI.', 'Creative Media', Icons.PosterIcon, ImageGenerator),
  createTool('logo_generator', 'Logo Generator', 'Generate unique and professional logos for your brand.', 'Creative Media', Icons.LogoIcon, ImageGenerator),
  createTool('fashion_design', 'Fashion Design AI', 'Create new and unique fashion design concepts.', 'Creative Media', Icons.FashionIcon, ImageGenerator),

  // --- Video Tools ---
  createTool('video_generator', 'AI Video Generator', 'Create stunning videos from text prompts.', 'Video', Icons.VideoIcon, VideoGenerator),
  createTool('music_video_creator', 'Music Video Creator', 'Generate a music video concept for a song.', 'Video', Icons.MusicVideoIcon, VideoGenerator),
  createTool('lip_sync_maker', 'Lip-Sync Video Maker', 'Animate a character to lip-sync to audio.', 'Video', Icons.LipSyncIcon, VideoGenerator),
  createTool('animated_story', 'Animated Story Generator', 'Create short animated stories from a script.', 'Video', Icons.StoryIcon, VideoGenerator),
  createTool('ad_commercial', 'Ad Commercial Creator', 'Generate a script and storyboard for a commercial.', 'Video', Icons.AdIcon, BusinessPlan),
  createTool('short_film_generator', 'Short Film Generator', 'Develop a concept and script for a short film.', 'Video', Icons.FilmIcon, BusinessPlan),
  createTool('talking_avatar', 'Talking Avatar Creator', 'Create an animated avatar that speaks your text.', 'Video', Icons.AvatarIcon, VideoGenerator),
  createTool('reels_creator', 'Reels Creator', 'Generate ideas and scripts for social media reels.', 'Video', Icons.ReelsIcon, BusinessPlan),
  createTool('cinematic_scene', 'Cinematic Scene Composer', 'Describe a scene and get a cinematic shot list.', 'Video', Icons.SceneIcon, BusinessPlan),
  createTool('video_bg_changer', 'Background Changer for Videos', 'Plan a video with a different background.', 'Video', Icons.BgChangeIcon, VideoGenerator),

  // --- Audio & Music Tools ---
  createTool('song_generator', 'Song Generator', 'Compose original music and songs.', 'Audio & Music', Icons.MusicIcon, SongGenerator),
  createTool('voice_cloner', 'Voice Cloner', 'Synthesize speech in various vocal styles.', 'Audio & Music', Icons.VoiceIcon, VoiceCloner),
  createTool('text_to_speech', 'Text-to-Speech', 'Convert text into natural-sounding speech.', 'Audio & Music', Icons.TtsIcon, TextToSpeech),
  createTool('podcast_maker', 'AI Podcast Maker', 'Generate a script for a podcast episode on any topic.', 'Audio & Music', Icons.PodcastIcon, BusinessPlan),
  createTool('sound_fx', 'Sound FX Generator', 'Generate sound effect descriptions for your projects.', 'Audio & Music', Icons.SoundFxIcon, StartupIdeaGenerator),
  createTool('audio_mastering', 'AI Audio Mastering', 'Get suggestions for mastering your audio tracks.', 'Audio & Music', Icons.MasteringIcon, StartupIdeaGenerator),
  createTool('beat_composer', 'Beat Composer', 'Generate beat patterns and drum loops ideas.', 'Audio & Music', Icons.BeatIcon, StartupIdeaGenerator),
  createTool('instrumental_generator', 'Instrumental Generator', 'Create concepts for instrumental background music.', 'Audio & Music', Icons.InstrumentalIcon, StartupIdeaGenerator),
  createTool('voice_translator', 'Voice Translator', 'Translate spoken words from one language to another.', 'Audio & Music', Icons.TranslateIcon, TextToSpeech),
  createTool('emotion_voice_synthesizer', 'Emotion Voice Synthesizer', 'Generate speech with specific emotional tones.', 'Audio & Music', Icons.EmotionVoiceIcon, VoiceCloner),

  // --- Code & Software Tools ---
  createTool('app_builder', 'App Builder', 'Generate full applications from a description.', 'Code & Software', Icons.AppIcon, AppBuilder),
  createTool('website_generator', 'Website Generator', 'Generate website code from a description.', 'Code & Software', Icons.WebsiteIcon, WebsiteGenerator),
  createTool('game_builder', 'Game Builder AI', 'Generate concepts and scripts for a new game.', 'Code & Software', Icons.GameIcon, AppBuilder),
  createTool('bug_fixer', 'Bug Fixer AI', 'Automatically detect and fix bugs in your code.', 'Code & Software', Icons.BugIcon, BugFixer),
  createTool('code_optimizer', 'Code Optimizer', 'Refactor and improve your code for efficiency.', 'Code & Software', Icons.CodeIcon, CodeOptimizer),
  createTool('ui_designer', 'UI Designer AI', 'Generate UI/UX concepts and component ideas.', 'Code & Software', Icons.UiIcon, AppBuilder),
  createTool('db_designer', 'Database Designer AI', 'Generate a database schema from requirements.', 'Code & Software', Icons.DatabaseIcon, AppBuilder),
  createTool('cybersecurity_assistant', 'Cybersecurity Assistant', 'Identify potential security vulnerabilities in code.', 'Code & Software', Icons.SecurityIcon, BugFixer),
  createTool('devops_pipeline', 'Auto DevOps Pipeline Generator', 'Generate a CI/CD pipeline configuration.', 'Code & Software', Icons.PipelineIcon, AppBuilder),
  createTool('api_builder', 'API Builder', 'Design and get code snippets for RESTful APIs.', 'Code & Software', Icons.ApiIcon, AppBuilder),

  // --- Business & Marketing Tools ---
  createTool('startup_idea', 'Startup Idea Generator', 'Get innovative startup ideas based on trends.', 'Business & Marketing', Icons.LightbulbIcon, StartupIdeaGenerator),
  createTool('business_plan', 'Business Plan AI', 'Generate a complete business plan.', 'Business & Marketing', Icons.BusinessIcon, BusinessPlan),
  createTool('ad_copy_creator', 'Ad Copy Creator', 'Write compelling copy for your advertisements.', 'Business & Marketing', Icons.AdCopyIcon, BusinessPlan),
  createTool('brand_name_generator', 'Brand Name Generator', 'Generate unique and catchy brand names.', 'Business & Marketing', Icons.BrandIcon, StartupIdeaGenerator),
  createTool('seo_optimizer', 'SEO Optimizer', 'Optimize your content for search engines.', 'Business & Marketing', Icons.SeoIcon, SeoOptimizer),
  createTool('market_research', 'Market Research Analyzer', 'Analyze market trends and competitor data.', 'Business & Marketing', Icons.MarketIcon, BusinessPlan),
  createTool('product_description', 'Product Description Writer', 'Write engaging product descriptions.', 'Business & Marketing', Icons.DescriptionIcon, SeoOptimizer),
  createTool('resume_builder', 'Auto Resume/CV Builder', 'Create a professional resume from your details.', 'Business & Marketing', Icons.ResumeIcon, DocumentReader),
  createTool('email_writer', 'Email Writer AI', 'Compose professional and effective emails.', 'Business & Marketing', Icons.EmailIcon, SeoOptimizer),
  createTool('customer_support_bot', 'Customer Support Bot', 'Simulate a customer support conversation.', 'Business & Marketing', Icons.SupportIcon, IndomindChat),

  // --- Education & Learning Tools ---
  createTool('student_tutor', 'Student Tutor AI', 'Personalized tutoring for any subject.', 'Education & Learning', Icons.TutorIcon, StudentTutor),
  createTool('quiz_generator', 'Quiz Generator', 'Create quizzes and tests on any topic.', 'Education & Learning', Icons.QuizIcon, StudentTutor),
  createTool('exam_maker', 'Exam Maker', 'Generate exam questions for various subjects.', 'Education & Learning', Icons.ExamIcon, StudentTutor),
  createTool('textbook_summarizer', 'Textbook Summarizer', 'Summarize chapters from a textbook.', 'Education & Learning', Icons.TextbookIcon, KnowledgeSummarizer),
  createTool('concept_visualizer', 'Concept Visualizer', 'Explain complex concepts in a simple, visual way.', 'Education & Learning', Icons.ConceptIcon, StudentTutor),
  createTool('language_learning_bot', 'Language Learning Bot', 'Practice speaking and translating with an AI.', 'Education & Learning', Icons.LanguageIcon, StudentTutor),
  createTool('math_solver', 'Math Problem Solver', 'Solve complex mathematical problems.', 'Education & Learning', Icons.MathIcon, MathSolver),
  createTool('code_learning_mentor', 'Code Learning Mentor', 'Get explanations and help with coding problems.', 'Education & Learning', Icons.CodeMentorIcon, StudentTutor),
  createTool('science_simulation', 'Science Simulation Generator', 'Describe and simulate scientific experiments.', 'Education & Learning', Icons.ScienceIcon, StudentTutor),
  createTool('history_story_builder', 'History Story Builder', 'Create engaging stories from historical events.', 'Education & Learning', Icons.HistoryIcon, StudentTutor),

  // --- Health & Lifestyle Tools ---
  createTool('fitness_planner', 'Fitness Planner AI', 'Create personalized fitness and workout plans.', 'Health & Lifestyle', Icons.FitnessIcon, FitnessPlanner),
  createTool('diet_planner', 'Diet Planner', 'Generate custom diet plans for your goals.', 'Health & Lifestyle', Icons.DietIcon, DietPlanner),
  createTool('sleep_analyzer', 'Sleep Pattern Analyzer', 'Get insights into improving your sleep quality.', 'Health & Lifestyle', Icons.SleepIcon, FitnessPlanner),
  createTool('stress_detector', 'Stress Detector', 'Analyze text to detect potential stress levels.', 'Health & Lifestyle', Icons.StressIcon, StudentTutor),
  createTool('meditation_assistant', 'Meditation Assistant', 'Generate guided meditation scripts.', 'Health & Lifestyle', Icons.MeditationIcon, FitnessPlanner),
  createTool('voice_emotion_analyzer', 'Voice Emotion Analyzer', 'Analyze emotional tone from text.', 'Health & Lifestyle', Icons.VoiceEmotionIcon, StudentTutor),
  createTool('health_report_generator', 'Health Report Generator', 'Summarize health data into a readable report.', 'Health & Lifestyle', Icons.HealthReportIcon, KnowledgeSummarizer),
  createTool('symptom_checker', 'Symptom Checker', 'Get information based on described symptoms.', 'Health & Lifestyle', Icons.SymptomIcon, StudentTutor),
  createTool('skin_care_advisor', 'Skin Care Advisor', 'Get personalized skin care routine advice.', 'Health & Lifestyle', Icons.SkincareIcon, FitnessPlanner),
  createTool('herbal_advisor', 'Herbal & Ayurveda Advisor', 'Get information on herbal and Ayurvedic remedies.', 'Health & Lifestyle', Icons.HerbalIcon, StudentTutor),

  // --- Astrology & Spiritual Tools ---
  createTool('horoscope_generator', 'Horoscope Generator', 'Get daily, weekly, and monthly horoscopes.', 'Astrology & Spiritual', Icons.HoroscopeIcon, HoroscopeGenerator),
  createTool('birth_chart_reader', 'Birth Chart Reader', 'Generate a basic interpretation of a birth chart.', 'Astrology & Spiritual', Icons.BirthChartIcon, HoroscopeGenerator),
  createTool('numerology_analyzer', 'Numerology Analyzer', 'Analyze names and dates for numerological insights.', 'Astrology & Spiritual', Icons.NumerologyIcon, HoroscopeGenerator),
  createTool('dream_interpreter', 'Dream Interpreter', 'Analyze and interpret your dreams.', 'Astrology & Spiritual', Icons.DreamIcon, DreamInterpreter),
  createTool('palmistry_scanner', 'Palmistry Scanner', 'Get a fun, AI-generated palm reading from a description.', 'Astrology & Spiritual', Icons.PalmistryIcon, DreamInterpreter),
  createTool('chakra_balancer', 'Chakra Balancer', 'Generate guided meditations for chakra balancing.', 'Astrology & Spiritual', Icons.ChakraIcon, FitnessPlanner),
  createTool('lucky_color_finder', 'Lucky Color Finder', 'Find your lucky color for the day based on astrology.', 'Astrology & Spiritual', Icons.ColorIcon, HoroscopeGenerator),
  createTool('compatibility_calculator', 'Compatibility Calculator', 'Calculate compatibility based on zodiac signs.', 'Astrology & Spiritual', Icons.CompatibilityIcon, HoroscopeGenerator),
  createTool('mantra_recommender', 'Mantra Recommender', 'Get mantra recommendations for your goals.', 'Astrology & Spiritual', Icons.MantraIcon, FitnessPlanner),
  createTool('fortune_prediction', 'Fortune Prediction AI', 'Get a fun, AI-generated fortune for the day.', 'Astrology & Spiritual', Icons.FortuneIcon, HoroscopeGenerator),

  // --- Utility & Daily Life Tools ---
  createTool('currency_converter', 'Currency Converter AI', 'Get information on currency conversions.', 'Utility & Daily Life', Icons.CurrencyIcon, StudentTutor),
  createTool('weather_forecaster', 'AI Weather Forecaster', 'Get a descriptive weather forecast.', 'Utility & Daily Life', Icons.WeatherIcon, StudentTutor),
  createTool('news_summarizer', 'AI News Summarizer', 'Get summaries of the latest news.', 'Utility & Daily Life', Icons.NewsIcon, NewsSummarizer),
  createTool('email_classifier', 'Email Classifier', 'Classify emails into categories like important, spam, etc.', 'Utility & Daily Life', Icons.EmailClassifyIcon, SeoOptimizer),
  createTool('file_translator', 'AI File Translator', 'Translate text content between languages.', 'Utility & Daily Life', Icons.FileTranslateIcon, TextToSpeech),
  createTool('handwriting_to_text', 'Handwriting to Text AI', 'Convert descriptions of handwriting to text.', 'Utility & Daily Life', Icons.HandwritingIcon, OcrScanner),
  createTool('text_to_handwriting', 'Text to Handwriting Generator', 'Generate images of text in a handwriting style.', 'Utility & Daily Life', Icons.TextToHandwritingIcon, ImageGenerator),
  createTool('speech_to_text', 'Speech to Text AI', 'Transcribe audio into text with high accuracy.', 'Utility & Daily Life', Icons.SpeechIcon, SpeechToText),
  createTool('ocr_scanner', 'OCR Scanner', 'Extract text from an image description.', 'Utility & Daily Life', Icons.OcrIcon, OcrScanner),
  createTool('smart_reminder', 'Smart Reminder Assistant', 'Set intelligent, context-aware reminders.', 'Utility & Daily Life', Icons.ReminderIcon, StudentTutor),
  createTool('schedule_planner', 'Auto Schedule Planner', 'Generate a daily or weekly schedule based on tasks.', 'Utility & Daily Life', Icons.ScheduleIcon, FitnessPlanner),
  createTool('world_info_generator', 'Real-Time World Info Generator', 'Get real-time information on any topic.', 'Utility & Daily Life', Icons.WorldIcon, WebDataSearch),
];
