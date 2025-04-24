import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilmIcon, BrainIcon, CogIcon, LineChartIcon, PlayCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-text flex flex-col">
      <ParticleBackground />
      <Header />
      
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center p-8 bg-primary-dark/80 backdrop-blur-md rounded-2xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg"
              alt="Cinema background" 
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative z-10">
            <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4 text-highlight">Welcome to Movie Sentiment Analysis</motion.h1>
            <motion.p variants={itemVariants} className="text-lg max-w-3xl mx-auto leading-relaxed">
              This dashboard provides insights into our AI-powered movie review analysis system. Explore the features of our sentiment analysis model, understand how it processes movie reviews, and discover patterns in viewer sentiments. When you're ready, begin your movie review analysis to get personalized insights and recommendations.
            </motion.p>
          </div>
        </motion.section>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                <BrainIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-highlight">Our ML Model</h3>
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="AI Model" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p>Our movie sentiment analysis system uses a state-of-the-art logistic regression model trained on thousands of movie reviews. The model has been fine-tuned to understand the nuances of movie criticism and can detect subtle sentiment patterns.</p>
              <p>Key features of our model include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Text preprocessing using the tm package</li>
                <li>Feature selection with sparse matrix handling</li>
                <li>Binary classification with probability scores</li>
                <li>High accuracy on test data (~85%)</li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                <CogIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-highlight">How It Works</h3>
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
                alt="Data Processing" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p>The system combines several data science techniques:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Text Processing:</strong> Converting raw reviews into structured data</li>
                <li><strong>Feature Extraction:</strong> Identifying key words that indicate sentiment</li>
                <li><strong>Aspect Analysis:</strong> Breaking down reviews into specific movie aspects</li>
                <li><strong>Emotion Detection:</strong> Identifying emotional content in reviews</li>
                <li><strong>Recommendation Engine:</strong> Suggesting similar movies based on genre and sentiment</li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                <LineChartIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-highlight">Data Science Insights</h3>
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg"
                alt="Data Analytics" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p>Our model leverages several key data science concepts:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Decision Trees:</strong> Used for aspect classification</li>
                <li><strong>Feature Selection:</strong> Identifying the most predictive words</li>
                <li><strong>Cross-Validation:</strong> Ensuring model reliability</li>
                <li><strong>Confusion Matrix Analysis:</strong> Measuring precision and recall</li>
                <li><strong>NLP Techniques:</strong> Extracting meaning from unstructured text</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 p-6 bg-primary-dark/60 backdrop-blur-md rounded-2xl shadow-xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-highlight mb-2">Model Pipeline</h2>
            <p>How our sentiment analysis processes your review</p>
          </div>
          
          <div className="relative flex justify-between items-center py-8">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>
            
            {[
              { icon: <FilmIcon size={24} />, label: 'Input Raw Review' },
              { icon: <CogIcon size={24} />, label: 'Text Preprocessing' },
              { icon: <LineChartIcon size={24} />, label: 'Feature Extraction' },
              { icon: <BrainIcon size={24} />, label: 'Model Prediction' },
              { icon: <LineChartIcon size={24} />, label: 'Aspect Analysis' },
              { icon: <LineChartIcon size={24} />, label: 'Visualization' }
            ].map((step, index) => (
              <div key={index} className="relative z-10 group">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-accent">
                  <div className="text-highlight group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-secondary text-text px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="text-center mb-8">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-highlight mb-2">Data Analytics Insights</motion.h2>
            <motion.p variants={itemVariants}>Explore patterns and trends in movie sentiment analysis</motion.p>
          </div>
          
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Sentiment Distribution', 
                desc: 'Distribution of positive and negative sentiments across different movie genres.',
                image: 'https://images.pexels.com/photos/7014926/pexels-photo-7014926.jpeg'
              },
              { 
                title: 'Aspect Radar Chart', 
                desc: 'Comparison of different movie aspects like plot, acting, and visual effects.',
                image: 'https://images.pexels.com/photos/590037/pexels-photo-590037.jpeg'
              },
              { 
                title: 'Emotion Analysis', 
                desc: 'Breakdown of emotional responses detected in movie reviews.',
                image: 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg'
              },
              { 
                title: 'Feature Importance', 
                desc: 'Most influential words in determining review sentiment.',
                image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg'
              }
            ].map((viz, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white/5 rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-48 bg-white/10 overflow-hidden">
                  <img 
                    src={viz.image}
                    alt={viz.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-highlight mb-2">{viz.title}</h4>
                  <p className="text-sm text-white/90">{viz.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-center mt-12"
        >
          <Link 
            to="/analysis" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-highlight text-secondary font-bold rounded-xl hover:bg-highlight/90 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-lg"
          >
            <PlayCircleIcon size={24} />
            Begin Analysis
          </Link>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;