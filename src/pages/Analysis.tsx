import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilmIcon, StarIcon, ListChecksIcon, BrainIcon, BarChartIcon as ChartBarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

interface Movie {
  title: string;
  year: string;
  duration: string;
  poster: string;
}

interface GenreMovies {
  [key: string]: Movie[];
}

interface AspectQuestion {
  id: number;
  question: string;
}

const Analysis: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<'movie' | 'aspect' | 'loading' | 'results'>('movie');
  const [selectedGenre, setSelectedGenre] = useState('Drama');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [aspectAnswers, setAspectAnswers] = useState<Record<number, string>>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Processing natural language...');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const genreMovies: GenreMovies = {
    'Drama': [
      {
        title: 'The Shawshank Redemption',
        year: '1994',
        duration: '142 min',
        poster: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg'
      },
      {
        title: 'The Godfather',
        year: '1972',
        duration: '175 min',
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
      },
      {
        title: "Schindler's List",
        year: '1993',
        duration: '195 min',
        poster: 'https://images.pexels.com/photos/3894828/pexels-photo-3894828.jpeg'
      },
      {
        title: 'Forrest Gump',
        year: '1994',
        duration: '142 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      },
      {
        title: 'The Green Mile',
        year: '1999',
        duration: '189 min',
        poster: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
      }
    ],
    'Action': [
      {
        title: 'The Dark Knight',
        year: '2008',
        duration: '152 min',
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
      },
      {
        title: 'Inception',
        year: '2010',
        duration: '148 min',
        poster: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
      },
      {
        title: 'Mad Max: Fury Road',
        year: '2015',
        duration: '120 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      },
      {
        title: 'Die Hard',
        year: '1988',
        duration: '132 min',
        poster: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg'
      },
      {
        title: 'John Wick',
        year: '2014',
        duration: '101 min',
        poster: 'https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg'
      }
    ],
    'Comedy': [
      {
        title: 'The Hangover',
        year: '2009',
        duration: '100 min',
        poster: 'https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg'
      },
      {
        title: 'Superbad',
        year: '2007',
        duration: '113 min',
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
      },
      {
        title: 'Bridesmaids',
        year: '2011',
        duration: '125 min',
        poster: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg'
      },
      {
        title: 'Step Brothers',
        year: '2008',
        duration: '98 min',
        poster: 'https://images.pexels.com/photos/3894828/pexels-photo-3894828.jpeg'
      },
      {
        title: 'Dumb and Dumber',
        year: '1994',
        duration: '107 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      }
    ],
    'Horror': [
      {
        title: 'The Shining',
        year: '1980',
        duration: '146 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      },
      {
        title: 'The Exorcist',
        year: '1973',
        duration: '122 min',
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
      },
      {
        title: 'Hereditary',
        year: '2018',
        duration: '127 min',
        poster: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
      },
      {
        title: 'A Quiet Place',
        year: '2018',
        duration: '90 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      },
      {
        title: 'The Conjuring',
        year: '2013',
        duration: '112 min',
        poster: 'https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg'
      }
    ],
    'Sci-Fi': [
      {
        title: 'Inception',
        year: '2010',
        duration: '148 min',
        poster: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
      },
      {
        title: 'Interstellar',
        year: '2014',
        duration: '169 min',
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
      },
      {
        title: 'Blade Runner 2049',
        year: '2017',
        duration: '164 min',
        poster: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
      },
      {
        title: 'Arrival',
        year: '2016',
        duration: '116 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      },
      {
        title: 'Ex Machina',
        year: '2014',
        duration: '108 min',
        poster: 'https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg'
      }
    ],
    'Romance': [
      {
        title: 'The Notebook',
        year: '2004',
        duration: '123 min',
        poster: 'https://images.pexels.com/photos/3894828/pexels-photo-3894828.jpeg'
      },
      {
        title: 'Pride & Prejudice',
        year: '2005',
        duration: '129 min',
        poster: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg'
      },
      {
        title: 'La La Land',
        year: '2016',
        duration: '128 min',
        poster: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
      },
      {
        title: 'Before Sunrise',
        year: '1995',
        duration: '101 min',
        poster: 'https://images.pexels.com/photos/2873277/pexels-photo-2873277.jpeg'
      },
      {
        title: 'Eternal Sunshine',
        year: '2004',
        duration: '108 min',
        poster: 'https://images.pexels.com/photos/7991634/pexels-photo-7991634.jpeg'
      }
    ]
  };

  const aspectQuestions: AspectQuestion[] = [
    { id: 1, question: "Did you enjoy the Acting performance?" },
    { id: 2, question: "Did you enjoy the Plot coherence?" },
    { id: 3, question: "Did you enjoy the Visual effects?" },
    { id: 4, question: "Did you enjoy the Soundtrack/Music?" },
    { id: 5, question: "Did you enjoy the Character development?" },
    { id: 6, question: "Did you enjoy the Dialogue quality?" },
    { id: 7, question: "Did you enjoy the Cinematography?" },
    { id: 8, question: "Did you enjoy the Pacing?" },
    { id: 9, question: "Did you enjoy the Story originality?" },
    { id: 10, question: "Did you enjoy the Direction?" }
  ];

  useEffect(() => {
    // Select a random movie when genre changes
    if (genreMovies[selectedGenre]) {
      const movies = genreMovies[selectedGenre];
      const randomIndex = Math.floor(Math.random() * movies.length);
      setSelectedMovie(movies[randomIndex]);
    }
  }, [selectedGenre]);

  const handleSubmitReview = () => {
    if (reviewText.trim() === '') {
      alert('Please write your review before continuing.');
      return;
    }
    setCurrentStep('aspect');
  };

  const handleAspectSelection = (aspectId: number, value: string) => {
    setAspectAnswers(prev => ({
      ...prev,
      [aspectId]: value
    }));
  };

  const handleSubmitAspects = () => {
    const unansweredAspects = aspectQuestions.filter(q => !aspectAnswers[q.id]);
    if (unansweredAspects.length > 0) {
      alert('Please answer all aspect questions before continuing.');
      return;
    }
    
    setCurrentStep('loading');
    
    const statusMessages = [
      'Processing natural language...',
      'Analyzing sentiment patterns...',
      'Evaluating aspect scores...',
      'Detecting emotions...',
      'Generating recommendations...',
      'Finalizing results...'
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
      progress++;
      if (progress < statusMessages.length) {
        setLoadingMessage(statusMessages[progress]);
        setLoadingProgress((progress + 1) / statusMessages.length * 100);
      } else if (progress >= statusMessages.length + 1) {
        clearInterval(interval);
        
        const analysisData = {
          movie: selectedMovie?.title,
          genre: selectedGenre,
          review: reviewText,
          aspects: aspectAnswers,
          sentiment: Math.random() * 0.3 + 0.7,
          emotions: ['Joy', 'Surprise', 'Trust'].sort(() => Math.random() - 0.5).slice(0, 3)
        };
        
        sessionStorage.setItem('analysis', JSON.stringify(analysisData));
        navigate('/visualizations');
      }
    }, 1000);
  };

  const handleBackToReview = () => {
    setCurrentStep('movie');
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-text flex flex-col">
      <Header showBackButton backUrl="/dashboard" />
      
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
          
          {[
            { step: 1, label: 'Select Genre', state: 'completed' },
            { step: 2, label: 'Review Movie', state: currentStep === 'movie' ? 'active' : (currentStep === 'aspect' || currentStep === 'loading' || currentStep === 'results' ? 'completed' : 'pending') },
            { step: 3, label: 'Aspect Analysis', state: currentStep === 'aspect' ? 'active' : (currentStep === 'loading' || currentStep === 'results' ? 'completed' : 'pending') },
            { step: 4, label: 'Results', state: currentStep === 'results' ? 'active' : 'pending' }
          ].map((step) => (
            <div key={step.step} className="relative z-10 text-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold mx-auto mb-2
                ${step.state === 'completed' ? 'bg-green-500 border-green-500' : 
                  step.state === 'active' ? 'bg-accent border-accent' : 
                  'bg-primary-dark/40 border-accent/20'}
                border-2 transition-all duration-300
              `}>
                {step.step}
              </div>
              <p className={`text-sm ${step.state === 'active' ? 'text-text font-semibold' : 'text-text/70'}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
        
        {/* Movie Review Section */}
        {currentStep === 'movie' && selectedMovie && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-highlight">
              <StarIcon className="text-accent" />
              Write Your Review
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-48 h-64 bg-white/10 rounded-lg overflow-hidden">
                <img 
                  src={selectedMovie.poster} 
                  alt={selectedMovie.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">{selectedMovie.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 rounded-md text-sm">{selectedGenre}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-md text-sm">{selectedMovie.duration}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-md text-sm">{selectedMovie.year}</span>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 text-sm">Select Genre</label>
                  <select 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                  >
                    {Object.keys(genreMovies).map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                
                <p>Please write your review for this movie. Be specific about what you liked or disliked to get the most accurate sentiment analysis.</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="review-text" className="block mb-2 text-sm">Your Review</label>
              <textarea
                id="review-text"
                className="w-full min-h-[150px] p-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSubmitReview}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Continue to Aspect Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Aspect Analysis Section */}
        {currentStep === 'aspect' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-highlight">
              <ListChecksIcon className="text-accent" />
              Aspect-Based Analysis
            </h2>
            
            <p className="mb-6">Please answer the following questions about specific aspects of the movie. These will help us provide a more detailed analysis.</p>
            
            <div className="space-y-6 mb-8">
              {aspectQuestions.map(aspect => (
                <div key={aspect.id} className="p-4 bg-white/5 rounded-lg">
                  <p className="font-semibold mb-3">{aspect.question}</p>
                  <div className="flex gap-4">
                    {['yes', 'maybe', 'no'].map(option => (
                      <button
                        key={option}
                        className={`
                          flex-1 py-2 px-4 rounded-md border transition-all
                          ${aspectAnswers[aspect.id] === option 
                            ? 'bg-accent text-white border-accent' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'}
                        `}
                        onClick={() => handleAspectSelection(aspect.id, option)}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBackToReview}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg flex items-center gap-2 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Review
              </button>
              
              <button
                onClick={handleSubmitAspects}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <BrainIcon size={20} />
                Analyze Sentiment
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Loading Section */}
        {currentStep === 'loading' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-dark/80 backdrop-blur-md rounded-2xl p-8 shadow-xl mb-8 flex flex-col items-center"
          >
            <div className="w-16 h-16 border-4 border-white/10 border-t-accent rounded-full animate-spin mb-8"></div>
            <h3 className="text-2xl font-semibold mb-4">Analyzing your review...</h3>
            <p className="text-text/70 mb-6">{loadingMessage}</p>
            
            <div className="w-full max-w-md h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;