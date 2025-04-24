import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilmIcon, HeartIcon, TargetIcon, UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, Title, BubbleController } from 'chart.js';
import { Radar, Pie, Bar, Bubble } from 'react-chartjs-2';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  BubbleController
);

interface AnalysisData {
  movie: string;
  genre: string;
  review: string;
  aspects: Record<number, string>;
  sentiment: number;
  emotions: string[];
}

const Visualizations: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Get analysis data from sessionStorage
    const storedData = sessionStorage.getItem('analysis');
    if (!storedData) {
      navigate('/analysis');
      return;
    }
    
    setAnalysisData(JSON.parse(storedData));
  }, [isAuthenticated, navigate]);

  // Generate aspect scores based on aspect answers
  const generateAspectScores = () => {
    if (!analysisData) return {};
    
    const aspects = {
      'Acting': 0,
      'Visuals': 0,
      'Plot': 0,
      'Pacing': 0,
      'Soundtrack': 0
    };
    
    // Map aspect questions to categories
    const aspectMapping = {
      1: 'Acting',
      2: 'Plot',
      3: 'Visuals',
      4: 'Soundtrack',
      5: 'Acting',
      6: 'Plot',
      7: 'Visuals',
      8: 'Pacing',
      9: 'Plot',
      10: 'Pacing'
    };
    
    // Calculate scores
    Object.entries(analysisData.aspects).forEach(([id, value]) => {
      const category = aspectMapping[id as unknown as keyof typeof aspectMapping];
      if (category) {
        if (value === 'yes') aspects[category] += 20;
        else if (value === 'maybe') aspects[category] += 10;
      }
    });
    
    // Normalize scores
    Object.keys(aspects).forEach(key => {
      const k = key as keyof typeof aspects;
      aspects[k] = Math.min(Math.max(aspects[k] + 50 + Math.random() * 20 - 10, 40), 95);
    });
    
    return aspects;
  };

  const aspectScores = generateAspectScores();

  // Chart data
  const radarData = {
    labels: ['Positive Words', 'Negative Words', 'Neutral Words', 'Emotion Intensity', 'Recommendation Strength', 'Technical Terms'],
    datasets: [
      {
        label: 'Review Analysis',
        data: [
          Math.round(analysisData?.sentiment ? analysisData.sentiment * 100 : 75),
          Math.round(analysisData?.sentiment ? 100 - analysisData.sentiment * 100 : 25),
          Math.round(40 + Math.random() * 20),
          Math.round(70 + Math.random() * 20),
          Math.round(75 + Math.random() * 15),
          Math.round(50 + Math.random() * 30)
        ],
        backgroundColor: 'rgba(74, 143, 231, 0.2)',
        borderColor: 'rgba(74, 143, 231, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(74, 143, 231, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(74, 143, 231, 1)'
      }
    ]
  };

  const wordCloudData = {
    datasets: [
      {
        label: 'Positive Words',
        data: [
          { x: 20, y: 30, r: 15 },
          { x: 40, y: 10, r: 10 },
          { x: 60, y: 40, r: 20 },
          { x: 80, y: 20, r: 15 }
        ],
        backgroundColor: 'rgba(46, 204, 113, 0.7)'
      },
      {
        label: 'Negative Words',
        data: [
          { x: 30, y: 70, r: 10 },
          { x: 70, y: 60, r: 7 }
        ],
        backgroundColor: 'rgba(255, 107, 107, 0.7)'
      },
      {
        label: 'Neutral Words',
        data: [
          { x: 10, y: 50, r: 5 },
          { x: 50, y: 80, r: 10 },
          { x: 90, y: 50, r: 8 }
        ],
        backgroundColor: 'rgba(243, 156, 18, 0.7)'
      }
    ]
  };

  // Highlight positive and negative words in the review
  const highlightReviewText = () => {
    if (!analysisData?.review) return '';
    
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'beautiful', 'stunning', 'impressive', 'enjoyed', 'recommend'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'boring', 'disappointing', 'waste', 'disliked', 'avoid'];
    
    let processedText = analysisData.review;
    
    // Apply highlights
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedText = processedText.replace(regex, `<span class="bg-green-500/30 px-1 rounded">$&</span>`);
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedText = processedText.replace(regex, `<span class="bg-red-500/30 px-1 rounded">$&</span>`);
    });
    
    return processedText;
  };

  // Generate movie recommendations based on genre
  const getRecommendations = () => {
    const genreRecommendations = {
      'Drama': [
        { title: "The Godfather", year: "1972", rating: "9.2", poster: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg" },
        { title: "Forrest Gump", year: "1994", rating: "8.8", poster: "https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" },
        { title: "Schindler's List", year: "1993", rating: "9.0", poster: "https://images.pexels.com/photos/3894828/pexels-photo-3894828.jpeg" },
        { title: "The Green Mile", year: "1999", rating: "8.6", poster: "https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg" }
      ],
      'Action': [
        { title: "Die Hard", year: "1988", rating: "8.2", poster: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg" },
        { title: "The Matrix", year: "1999", rating: "8.7", poster: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg" },
        { title: "Mad Max: Fury Road", year: "2015", rating: "8.1", poster: "https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg" },
        { title: "John Wick", year: "2014", rating: "7.4", poster: "https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg" }
      ],
      'Comedy': [
        { title: "Superbad", year: "2007", rating: "7.6", poster: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg" },
        { title: "Bridesmaids", year: "2011", rating: "6.8", poster: "https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" },
        { title: "Step Brothers", year: "2008", rating: "6.9", poster: "https://images.pexels.com/photos/3894828/pexels-photo-3894828.jpeg" },
        { title: "Dumb and Dumber", year: "1994", rating: "7.3", poster: "https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg" }
      ],
      'Horror': [
        { title: "The Exorcist", year: "1973", rating: "8.1", poster: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg" },
        { title: "Hereditary", year: "2018", rating: "7.3", poster: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg" },
        { title: "A Quiet Place", year: "2018", rating: "7.5", poster: "https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg" },
        { title: "The Conjuring", year: "2013", rating: "7.5", poster: "https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg" }
      ],
      'Sci-Fi': [
        { title: "Interstellar", year: "2014", rating: "8.6", poster: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg" },
        { title: "Blade Runner 2049", year: "2017", rating: "8.0", poster: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg" },
        { title: "Arrival", year: "2016", rating: "7.9", poster: "https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg" },
        { title: "Ex Machina", year: "2014", rating: "7.7", poster: "https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg" }
      ],
      'Romance': [
        { title: "Pride & Prejudice", year: "2005", rating: "7.8", poster: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg" },
        { title: "La La Land", year: "2016", rating: "8.0", poster: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg" },
        { title: "Before Sunrise", year: "1995", rating: "8.1", poster: "https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg" },
        { title: "Eternal Sunshine", year: "2004", rating: "8.3", poster: "https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg" }
      ]
    };
    
    return analysisData?.genre && genreRecommendations[analysisData.genre] 
      ? genreRecommendations[analysisData.genre] 
      : genreRecommendations['Drama'];
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-text flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/10 border-t-accent rounded-full animate-spin mb-8"></div>
        <p>Loading analysis data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-text flex flex-col">
      <ParticleBackground />
      <Header showBackButton backUrl="/dashboard" />
      
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 p-6 bg-primary-dark/80 backdrop-blur-md rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-4 text-highlight">Sentiment Analysis Results</h1>
          <p className="text-lg max-w-3xl mx-auto">
            We've analyzed your movie review using our advanced NLP model. Here's what we found about the sentiment, key aspects, and emotional tone of your review.
          </p>
        </motion.section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col gap-6"
          >
            <div className="text-center py-6">
              <div 
                className="w-36 h-36 mx-auto rounded-full flex items-center justify-center text-4xl font-bold relative"
                style={{ 
                  background: `conic-gradient(#2ecc71 0% ${analysisData.sentiment * 100}%, rgba(255, 255, 255, 0.1) ${analysisData.sentiment * 100}% 100%)` 
                }}
              >
                <div className="absolute inset-3 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-highlight">{Math.round(analysisData.sentiment * 100)}%</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4 text-green-400">
                {analysisData.sentiment > 0.8 ? 'Very Positive' : 
                 analysisData.sentiment > 0.6 ? 'Positive' : 
                 analysisData.sentiment > 0.4 ? 'Neutral' : 
                 analysisData.sentiment > 0.2 ? 'Negative' : 'Very Negative'} Sentiment
              </h3>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-highlight">Key Highlights</h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg flex gap-3">
                  <div className="text-accent mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    Strong positive sentiment toward <strong>acting performances</strong> and <strong>visual effects</strong>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg flex gap-3">
                  <div className="text-accent mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    Mixed feelings about the <strong>plot development</strong> and <strong>pacing</strong>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg flex gap-3">
                  <div className="text-accent mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    Overall recommendation indicated by positive closing sentiment
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg italic relative">
              <div className="absolute -top-4 left-4 text-6xl text-accent opacity-30">"</div>
              <p className="relative z-10 pl-4" dangerouslySetInnerHTML={{ __html: highlightReviewText() }}></p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col gap-8"
          >
            <div className="h-64">
              <Radar 
                data={radarData} 
                options={{
                  scales: {
                    r: {
                      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      pointLabels: { 
                        color: 'rgba(224, 231, 255, 0.8)',
                        font: { size: 12 }
                      },
                      ticks: {
                        backdropColor: 'transparent',
                        color: 'rgba(224, 231, 255, 0.6)',
                        z: 1
                      }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-highlight">Aspect Analysis</h3>
              
              <div className="space-y-4">
                {Object.entries(aspectScores).map(([aspect, score]) => (
                  <div key={aspect} className="flex items-center gap-4">
                    <div className="w-24 text-sm">{aspect}</div>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          score >= 70 ? 'bg-green-500' : 
                          score >= 40 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium">{Math.round(score)}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-64">
              <Bubble 
                data={wordCloudData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    x: {
                      display: false,
                      grid: { display: false }
                    },
                    y: {
                      display: false,
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgba(224, 231, 255, 0.8)',
                        font: { size: 12 },
                        boxWidth: 12
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const wordMap: Record<string, string> = {
                            '20,30': 'stunning',
                            '40,10': 'remarkable',
                            '60,40': 'recommend',
                            '80,20': 'satisfying',
                            '30,70': 'drags',
                            '70,60': 'slow',
                            '10,50': 'while',
                            '50,80': 'overall',
                            '90,50': 'worth'
                          };
                          
                          const key = `${context.raw.x},${context.raw.y}`;
                          return wordMap[key] || '';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          <div className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-highlight">
              <HeartIcon size={20} className="text-accent" />
              Emotional Analysis
            </h3>
            <p>The review exhibits a range of emotions with predominantly positive sentiment. Here are the main emotional tones detected:</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {analysisData.emotions.map((emotion, index) => (
                <div key={index} className="px-4 py-2 bg-white/10 rounded-full flex items-center gap-2">
                  <i className={`fas fa-${
                    emotion === 'Joy' ? 'star' : 
                    emotion === 'Surprise' ? 'lightbulb' : 
                    emotion === 'Trust' ? 'thumbs-up' : 
                    emotion === 'Anticipation' ? 'smile' : 
                    emotion === 'Sadness' ? 'frown' : 
                    emotion === 'Anger' ? 'angry' : 
                    emotion === 'Fear' ? 'skull' : 
                    'dizzy'
                  }`}></i>
                  <span>{emotion}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-highlight">
              <TargetIcon size={20} className="text-accent" />
              Sentiment Drivers
            </h3>
            <p>These key phrases had the strongest impact on the overall sentiment score:</p>
            <ul className="mt-4 ml-6 space-y-2 list-disc">
              <li><strong>Positive:</strong> "stunning visual effects", "remarkable performances", "strong character development"</li>
              <li><strong>Negative:</strong> "plot drags in the middle"</li>
              <li><strong>Conclusion:</strong> "definitely recommend" (strong positive indicator)</li>
            </ul>
          </div>
          
          <div className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-highlight">
              <UsersIcon size={20} className="text-accent" />
              Audience Insights
            </h3>
            <p>Based on your review, this movie would likely appeal to:</p>
            <ul className="mt-4 ml-6 space-y-2 list-disc">
              <li>Viewers who prioritize visual effects and production quality</li>
              <li>Those who appreciate strong acting performances</li>
              <li>Audiences who can tolerate some pacing issues for character development</li>
              <li>Fan communities of the {analysisData.genre} genre</li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-highlight">Movies You Might Also Like</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {getRecommendations().map((movie, index) => (
              <div key={index} className="bg-white/5 rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="h-48 bg-white/10">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-1 truncate">{movie.title}</h4>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>{movie.year}</span>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 mt-8"
        >
          <button 
            onClick={() => navigate('/analysis')}
            className="px-6 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent/10 font-semibold rounded-lg flex items-center gap-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            New Analysis
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Return Home
          </button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Visualizations;