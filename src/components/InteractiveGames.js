import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGamepad, 
  FaUsers, 
  FaFlask, 
  FaCalculator,
  FaTrophy,
  FaCoins,
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaAtom,
  FaRocket
} from 'react-icons/fa';

const InteractiveGames = ({ userAddress, isConnected }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Overall gaming statistics
  const [gamingStats, setGamingStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    tokensEarned: 0,
    achievements: 0
  });

  // Function to update gaming statistics
  const updateGamingStats = (score, tokens, achievement = false) => {
    // Input validation
    if (typeof score !== 'number' || score < 0) {
      console.warn('Invalid score provided to updateGamingStats:', score);
      return;
    }
    if (typeof tokens !== 'number' || tokens < 0) {
      console.warn('Invalid tokens provided to updateGamingStats:', tokens);
      return;
    }

    setGamingStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + score,
      tokensEarned: prev.tokensEarned + tokens,
      achievements: prev.achievements + (achievement ? 1 : 0)
    }));
  };

  // Game data
  const games = [
    {
      id: 'math-puzzle',
      title: 'Math Puzzle Challenge',
      description: 'Solve mathematical puzzles to earn STEM tokens',
      icon: FaCalculator,
      type: 'puzzle',
      difficulty: 'Easy',
      reward: 25,
      color: 'blue'
    },
    {
      id: 'science-simulation',
      title: 'Chemistry Lab Simulation',
      description: 'Conduct virtual chemistry experiments',
      icon: FaFlask,
      type: 'simulation',
      difficulty: 'Medium',
      reward: 50,
      color: 'green'
    },
    {
      id: 'physics-challenge',
      title: 'Physics Problem Solver',
      description: 'Solve physics problems with interactive tools and calculations',
      icon: FaAtom,
      type: 'puzzle',
      difficulty: 'Hard',
      reward: 75,
      color: 'purple'
    },
    {
      id: 'collaborative-coding',
      title: 'Collaborative Coding',
      description: 'Work with other students on coding challenges',
      icon: FaUsers,
      type: 'collaborative',
      difficulty: 'Medium',
      reward: 100,
      color: 'orange'
    },
    {
      id: 'space-exploration',
      title: 'Space Exploration Game',
      description: 'Navigate through space while learning astronomy',
      icon: FaRocket,
      type: 'simulation',
      difficulty: 'Easy',
      reward: 40,
      color: 'indigo'
    },
    {
      id: 'engineering-design',
      title: 'Engineering Design Challenge',
      description: 'Design and test engineering solutions',
      icon: FaLightbulb,
      type: 'simulation',
      difficulty: 'Hard',
      reward: 80,
      color: 'red'
    }
  ];

  // Math Puzzle Game Component
  const MathPuzzleGame = ({ onScoreUpdate }) => {
    const [currentProblem, setCurrentProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [problemsSolved, setProblemsSolved] = useState(0);
    const [feedback, setFeedback] = useState('');

    const problems = [
      { question: "What is 15 × 8?", answer: 120, hint: "Think of 10 × 8 + 5 × 8" },
      { question: "Solve: 3x + 7 = 22", answer: 5, hint: "Subtract 7 from both sides first" },
      { question: "What is the area of a circle with radius 5?", answer: 78.54, hint: "Use π × r²" },
      { question: "What is √144?", answer: 12, hint: "What number squared equals 144?" },
      { question: "Calculate: 2³ + 3²", answer: 17, hint: "2³ = 8, 3² = 9" }
    ];

    const generateNewProblem = useCallback(() => {
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      setCurrentProblem(randomProblem);
      setUserAnswer('');
      setFeedback('');
    }, []);

    useEffect(() => {
      if (activeGame === 'math-puzzle' && !currentProblem) {
        generateNewProblem();
      }
    }, [activeGame, currentProblem, generateNewProblem]);

    const checkAnswer = () => {
      // Input validation
      if (!userAnswer || userAnswer.trim() === '') {
        setFeedback('❌ Please enter an answer before checking.');
        return;
      }

      if (!currentProblem) {
        setFeedback('❌ No problem available. Please refresh the game.');
        return;
      }

      const userAnswerNum = parseFloat(userAnswer);
      if (isNaN(userAnswerNum)) {
        setFeedback('❌ Please enter a valid number.');
        return;
      }

      // Check if answer is correct (with small tolerance for floating point numbers)
      const tolerance = 0.01;
      const isCorrect = Math.abs(userAnswerNum - currentProblem.answer) < tolerance;

      if (isCorrect) {
        const newScore = score + 10;
        const newProblemsSolved = problemsSolved + 1;
        setScore(newScore);
        setProblemsSolved(newProblemsSolved);
        setFeedback('✅ Correct! Great job!');
        
        // Update overall statistics
        onScoreUpdate(10, 2.5); // 10 points, 2.5 tokens per correct answer
        
        setTimeout(() => {
          generateNewProblem();
        }, 2000);
      } else {
        setFeedback(`❌ Incorrect. The answer is ${currentProblem.answer}. ${currentProblem.hint}`);
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <FaCalculator className="text-4xl text-blue-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Math Puzzle Challenge</h3>
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <span>Score: <span className="font-bold text-blue-600">{score}</span></span>
            <span>Solved: <span className="font-bold text-green-600">{problemsSolved}</span></span>
          </div>
        </div>

        {currentProblem && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {currentProblem.question}
              </h4>
              <div className="flex justify-center space-x-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold"
                  placeholder="Your answer"
                />
                <button
                  onClick={checkAnswer}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  Check
                </button>
              </div>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className={`p-4 rounded-lg text-center border-2 ${
                  feedback.includes('✅') 
                    ? 'bg-green-50 text-green-700 border-green-300 shadow-lg' 
                    : 'bg-red-50 text-red-700 border-red-300 shadow-lg'
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-2xl mb-2"
                >
                  {feedback.includes('✅') ? '🎉' : '😔'}
                </motion.div>
                {feedback}
              </motion.div>
            )}

            <div className="text-center">
              <button
                onClick={generateNewProblem}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                Skip Problem
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Science Simulation Game Component
  const ScienceSimulationGame = ({ onScoreUpdate }) => {
    const [experiment, setExperiment] = useState('acid-base');
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showResult, setShowResult] = useState(false);

    // Debug: Track step changes
    useEffect(() => {
      console.log('🧪 CHEMISTRY: Step changed to:', step);
    }, [step]);

    const experiments = {
      'acid-base': {
        name: 'Acid-Base Titration',
        steps: [
          { action: 'Add 10ml of HCl to the beaker', type: 'action', color: 'red' },
          { action: 'Add 2 drops of phenolphthalein indicator', type: 'action', color: 'purple' },
          { action: 'Slowly add NaOH solution drop by drop', type: 'action', color: 'blue' },
          { action: 'Observe the color change to pink', type: 'observation', color: 'pink' },
          { action: 'Record the volume of NaOH used (ml)', type: 'input', color: 'green', correctAnswer: 8.5, tolerance: 0.5 }
        ],
        description: 'Determine the concentration of HCl using NaOH titration'
      },
      'combustion': {
        name: 'Magnesium Combustion',
        steps: [
          { action: 'Weigh the empty crucible (g)', type: 'input', color: 'gray', correctAnswer: 25.3, tolerance: 0.1 },
          { action: 'Add 0.5g magnesium ribbon to crucible', type: 'action', color: 'silver' },
          { action: 'Heat the crucible with Bunsen burner', type: 'action', color: 'orange' },
          { action: 'Observe the bright white light and white smoke', type: 'observation', color: 'white' },
          { action: 'Weigh the final product (g)', type: 'input', color: 'gray', correctAnswer: 25.83, tolerance: 0.1 }
        ],
        description: 'Study the combustion reaction of magnesium with oxygen'
      },
      'electrolysis': {
        name: 'Water Electrolysis',
        steps: [
          { action: 'Fill the electrolysis cell with distilled water', type: 'action', color: 'blue' },
          { action: 'Add a few drops of sulfuric acid as electrolyte', type: 'action', color: 'yellow' },
          { action: 'Connect electrodes to power supply (6V)', type: 'action', color: 'red' },
          { action: 'Observe bubbles forming at both electrodes', type: 'observation', color: 'white' },
          { action: 'Measure gas volume ratio (H2:O2)', type: 'input', color: 'green', correctAnswer: 2, tolerance: 0.2 }
        ],
        description: 'Decompose water into hydrogen and oxygen gases'
      }
    };

    const handleStepComplete = () => {
      console.log('🧪 CHEMISTRY: handleStepComplete called, current step:', step);
      console.log('🧪 CHEMISTRY: This should appear when you click Complete Step button');
      
      if (!experiments[experiment]) {
        setFeedback('❌ Invalid experiment. Please refresh the game.');
        return;
      }

      const currentStepData = experiments[experiment].steps[step];
      const totalSteps = experiments[experiment].steps.length;
      
      console.log('Current step data:', currentStepData);
      console.log('Total steps:', totalSteps);

      if (currentStepData.type === 'input') {
        const userValue = parseFloat(userInput);
        if (isNaN(userValue)) {
          setFeedback('❌ Please enter a valid number.');
          return;
        }

        const isCorrect = Math.abs(userValue - currentStepData.correctAnswer) <= currentStepData.tolerance;
        
        if (isCorrect) {
          setFeedback('✅ Correct measurement!');
          setShowResult(true);
          const newScore = score + 25;
          setScore(newScore);
          onScoreUpdate(25, 6.25);
          
        setTimeout(() => {
          console.log('🧪 CHEMISTRY: setTimeout callback executing (input step)');
          console.log('🧪 CHEMISTRY: Current step before update:', step);
          console.log('🧪 CHEMISTRY: Total steps:', totalSteps);
          
          if (step < totalSteps - 1) {
            console.log('🧪 CHEMISTRY: Moving to next step:', step + 1);
            setStep(step + 1);
            setUserInput('');
            setFeedback('');
            setShowResult(false);
          } else {
            console.log('🧪 CHEMISTRY: Experiment completed!');
            const finalScore = newScore + 50;
            setScore(finalScore);
            onScoreUpdate(50, 12.5, true);
            setFeedback('🎉 Experiment completed successfully! You earned 50 bonus points and an achievement!');
          }
        }, 2000);
        } else {
          setFeedback(`❌ Incorrect. Expected: ${currentStepData.correctAnswer} ± ${currentStepData.tolerance}. Try again!`);
        }
      } else {
        // For action and observation steps
        console.log('Processing action/observation step');
        setFeedback('✅ Step completed!');
        setShowResult(true);
        const newScore = score + 15;
        setScore(newScore);
        onScoreUpdate(15, 3.75);
        
        setTimeout(() => {
          console.log('🧪 CHEMISTRY: setTimeout callback executing');
          console.log('🧪 CHEMISTRY: Current step before update:', step);
          console.log('🧪 CHEMISTRY: Total steps:', totalSteps);
          
          if (step < totalSteps - 1) {
            console.log('🧪 CHEMISTRY: Moving to next step:', step + 1);
            setStep(step + 1);
            setFeedback('');
            setShowResult(false);
          } else {
            console.log('🧪 CHEMISTRY: Experiment completed!');
            const finalScore = newScore + 50;
            setScore(finalScore);
            onScoreUpdate(50, 12.5, true);
            setFeedback('🎉 Experiment completed successfully! You earned 50 bonus points and an achievement!');
          }
        }, 1500);
      }
    };

    const currentStepData = experiments[experiment].steps[step];
    const experimentOptions = Object.keys(experiments);
    
    console.log('🧪 CHEMISTRY: Rendering with step:', step, 'currentStepData:', currentStepData);
    console.log('🧪 CHEMISTRY: If you see this, you are in the Chemistry Lab Simulation');
    console.log('🧪 CHEMISTRY: Step display should show:', `Step ${step + 1} of ${experiments[experiment].steps.length}`);

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <FaFlask className="text-4xl text-green-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {experiments[experiment].name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {experiments[experiment].description}
          </p>
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-green-600">{score}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / experiments[experiment].steps.length) * 100}%` }}
            />
          </div>

          {/* Current Step */}
          <motion.div 
            key={`step-${step}-${experiment}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-lg p-4 border-l-4 ${
              currentStepData.type === 'action' ? 'bg-blue-50 border-blue-400' :
              currentStepData.type === 'observation' ? 'bg-yellow-50 border-yellow-400' :
              'bg-green-50 border-green-400'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                currentStepData.type === 'action' ? 'bg-blue-100 text-blue-800' :
                currentStepData.type === 'observation' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {currentStepData.type.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                Step {step + 1} of {experiments[experiment].steps.length}
              </span>
            </div>
            
            <h4 className="font-semibold text-gray-800 mb-3">
              {currentStepData.action}
            </h4>

            {currentStepData.type === 'input' && (
              <div className="mb-4">
                <input
                  type="number"
                  step="0.1"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold"
                  placeholder="Enter your measurement"
                />
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // console.log('Complete Step clicked for:', currentStepData.type);
                  handleStepComplete();
                }}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {currentStepData.type === 'input' ? 'Submit Answer' : 'Complete Step →'}
              </motion.button>
              {step > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStep(Math.max(0, step - 1));
                    setUserInput('');
                    setFeedback('');
                    setShowResult(false);
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                >
                  ← Previous
                </motion.button>
              )}
            </div>
            
            {/* Help text for action steps */}
            {currentStepData.type === 'action' && (
              <div className="text-center mt-3">
                <p className="text-sm text-gray-600">
                  💡 Click "Complete Step" to proceed to the next action
                </p>
              </div>
            )}
          </motion.div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-lg text-center ${
                feedback.includes('✅') || feedback.includes('🎉') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {feedback}
            </motion.div>
          )}

          {/* Experiment Selection */}
          <div className="text-center">
            <div className="mb-2">
              <span className="text-sm text-gray-600">Switch Experiment:</span>
            </div>
            <div className="flex justify-center space-x-2">
              {experimentOptions.map((expKey) => (
                <motion.button
                  key={expKey}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              onClick={() => {
                    setExperiment(expKey);
                setStep(0);
                    setUserInput('');
                    setFeedback('');
                    setShowResult(false);
                  }}
                  className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                    experiment === expKey
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {experiments[expKey].name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Physics Problem Solver Component
  const PhysicsProblemSolver = ({ onScoreUpdate }) => {
    const [currentProblem, setCurrentProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [problemsSolved, setProblemsSolved] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showSolution, setShowSolution] = useState(false);

    const physicsProblems = [
      {
        question: "A ball is dropped from a height of 20m. What is its velocity when it hits the ground? (g = 9.8 m/s²)",
        answer: 19.8,
        hint: "Use v² = u² + 2as where u=0, a=9.8, s=20",
        solution: "v² = 0² + 2(9.8)(20) = 392, so v = √392 = 19.8 m/s"
      },
      {
        question: "A 2kg object is pushed with a force of 10N. What is its acceleration?",
        answer: 5,
        hint: "Use F = ma, so a = F/m",
        solution: "a = F/m = 10N / 2kg = 5 m/s²"
      },
      {
        question: "What is the kinetic energy of a 5kg object moving at 10 m/s?",
        answer: 250,
        hint: "Use KE = ½mv²",
        solution: "KE = ½ × 5 × 10² = ½ × 5 × 100 = 250 J"
      },
      {
        question: "A spring with k=100 N/m is compressed by 0.1m. What is the potential energy stored?",
        answer: 0.5,
        hint: "Use PE = ½kx²",
        solution: "PE = ½ × 100 × (0.1)² = ½ × 100 × 0.01 = 0.5 J"
      }
    ];

    const generateNewProblem = useCallback(() => {
      const randomProblem = physicsProblems[Math.floor(Math.random() * physicsProblems.length)];
      setCurrentProblem(randomProblem);
      setUserAnswer('');
      setFeedback('');
      setShowSolution(false);
    }, []);

    useEffect(() => {
      if (activeGame === 'physics-challenge' && !currentProblem) {
        generateNewProblem();
      }
    }, [activeGame, currentProblem, generateNewProblem]);

    const checkAnswer = () => {
      if (!userAnswer || userAnswer.trim() === '') {
        setFeedback('❌ Please enter an answer before checking.');
        return;
      }

      const userAnswerNum = parseFloat(userAnswer);
      if (isNaN(userAnswerNum)) {
        setFeedback('❌ Please enter a valid number.');
        return;
      }

      const tolerance = 0.1;
      const isCorrect = Math.abs(userAnswerNum - currentProblem.answer) < tolerance;

      if (isCorrect) {
        const newScore = score + 15;
        const newProblemsSolved = problemsSolved + 1;
        setScore(newScore);
        setProblemsSolved(newProblemsSolved);
        setFeedback('✅ Excellent! You solved the physics problem!');
        onScoreUpdate(15, 3.75);
        
        setTimeout(() => {
          generateNewProblem();
        }, 2500);
      } else {
        setFeedback(`❌ Incorrect. The answer is ${currentProblem.answer}. ${currentProblem.hint}`);
        setShowSolution(true);
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <FaAtom className="text-4xl text-purple-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Physics Problem Solver</h3>
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <span>Score: <span className="font-bold text-purple-600">{score}</span></span>
            <span>Solved: <span className="font-bold text-green-600">{problemsSolved}</span></span>
          </div>
        </div>

        {currentProblem && (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                {currentProblem.question}
              </h4>
              <div className="flex justify-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold"
                  placeholder="Your answer"
                />
                <button
                  onClick={checkAnswer}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
                >
                  Check
                </button>
              </div>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className={`p-4 rounded-lg text-center border-2 ${
                  feedback.includes('✅') 
                    ? 'bg-green-50 text-green-700 border-green-300 shadow-lg' 
                    : 'bg-red-50 text-red-700 border-red-300 shadow-lg'
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-2xl mb-2"
                >
                  {feedback.includes('✅') ? '⚡' : '🔬'}
                </motion.div>
                {feedback}
              </motion.div>
            )}

            {showSolution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <h5 className="font-semibold text-blue-800 mb-2">Solution:</h5>
                <p className="text-blue-700">{currentProblem.solution}</p>
              </motion.div>
            )}

            <div className="text-center">
              <button
                onClick={generateNewProblem}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                New Problem
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Collaborative Coding Game Component
  const CollaborativeCodingGame = ({ onScoreUpdate }) => {
    const [code, setCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [score, setScore] = useState(0);
    const [collaborators] = useState(['Alice', 'Bob', 'Charlie']);

    const challenges = [
      {
        title: 'Sum of Two Numbers',
        description: 'Write a function that returns the sum of two numbers',
        testCases: [
          { input: 'sum(2, 3)', expected: 5 },
          { input: 'sum(-1, 1)', expected: 0 },
          { input: 'sum(10, 20)', expected: 30 }
        ]
      },
      {
        title: 'Factorial Function',
        description: 'Write a function that calculates the factorial of a number',
        testCases: [
          { input: 'factorial(5)', expected: 120 },
          { input: 'factorial(3)', expected: 6 },
          { input: 'factorial(0)', expected: 1 }
        ]
      }
    ];

    const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);

    const runTests = () => {
      // Input validation
      if (!code || code.trim() === '') {
        alert('❌ Please write some code before running tests.');
        return;
      }

      if (!currentChallenge || !currentChallenge.testCases) {
        alert('❌ No test cases available. Please refresh the game.');
        return;
      }

      const results = currentChallenge.testCases.map(test => {
        try {
          // Create a safer evaluation context
          const safeCode = code.replace(/[^a-zA-Z0-9\s=+\-*/(){}[\].,;:'"]/g, '');
          if (safeCode !== code) {
            return {
              test: test.input,
              expected: test.expected,
              actual: 'Invalid characters detected',
              passed: false
            };
          }

          // Simple evaluation (in production, use a proper code sandbox)
          // eslint-disable-next-line no-eval
          const result = eval(code + '; ' + test.input);
          return {
            test: test.input,
            expected: test.expected,
            actual: result,
            passed: result === test.expected
          };
        } catch (error) {
          return {
            test: test.input,
            expected: test.expected,
            actual: `Error: ${error.message}`,
            passed: false
          };
        }
      });
      
      setTestResults(results);
      const passedTests = results.filter(r => r.passed).length;
      const pointsEarned = passedTests * 25;
      const tokensEarned = passedTests * 6.25; // 6.25 tokens per passed test
      setScore(score + pointsEarned);
      
      // Update overall statistics
      onScoreUpdate(pointsEarned, tokensEarned, passedTests === results.length);
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <FaUsers className="text-4xl text-orange-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Collaborative Coding</h3>
          <div className="text-sm text-gray-600 mb-2">
            Score: <span className="font-bold text-orange-600">{score}</span>
          </div>
          <div className="text-sm text-gray-600">
            Collaborators: {collaborators.join(', ')}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              {currentChallenge.title}
            </h4>
            <p className="text-gray-600 mb-3">
              {currentChallenge.description}
            </p>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Write your code here..."
            />
            <div className="mt-3 flex justify-center space-x-2">
              <button
                onClick={runTests}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
              >
                Run Tests
              </button>
              <button
                onClick={() => {
                  setCurrentChallenge(
                    currentChallenge === challenges[0] ? challenges[1] : challenges[0]
                  );
                  setCode('');
                  setTestResults([]);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
              >
                New Challenge
              </button>
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-800">Test Results:</h5>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {result.passed ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                    <span className="font-mono text-sm">
                      {result.test} → Expected: {result.expected}, Got: {result.actual}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getGameComponent = () => {
    if (!activeGame) {
      return null;
    }

    switch (activeGame) {
      case 'math-puzzle':
        return <MathPuzzleGame onScoreUpdate={updateGamingStats} />;
      case 'science-simulation':
        return <ScienceSimulationGame onScoreUpdate={updateGamingStats} />;
      case 'physics-challenge':
        return <PhysicsProblemSolver onScoreUpdate={updateGamingStats} />;
      case 'collaborative-coding':
        return <CollaborativeCodingGame onScoreUpdate={updateGamingStats} />;
      default:
        console.warn('Unknown game type:', activeGame);
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Game Not Found</h3>
            <p className="text-gray-600">The selected game is not available. Please try a different game.</p>
          </div>
        );
    }
  };

  const startGame = (gameId) => {
    // Input validation
    if (!gameId) {
      alert('❌ Invalid game ID. Please try again.');
      return;
    }

    const game = games.find(g => g.id === gameId);
    if (!game) {
      alert('❌ Game not found. Please try again.');
      return;
    }

    setActiveGame(gameId);
    setGameScore(0);
    setIsPlaying(true);
  };

  const stopGame = () => {
    if (!isPlaying || !activeGame) {
      return;
    }

    setIsPlaying(false);
    const currentGameId = activeGame;
    setActiveGame(null);
    
    // Award tokens based on score
    const game = games.find(g => g.id === currentGameId);
    if (game && gameScore > 0) {
      // Update statistics for game completion
      updateGamingStats(gameScore, game.reward, gameScore > 50);
      alert(`🎉 Game completed! You earned ${gameScore} points and ${game.reward} STEM tokens!`);
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-purple-500/20"
      >
        <FaGamepad className="text-6xl text-gradient-orange mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-purple-200">
          Connect your MetaMask wallet to access interactive STEM games and earn tokens!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <FaGamepad className="text-gradient-orange" />
            <span>Interactive STEM Games</span>
          </h2>
          <p className="text-purple-200 mt-1">
            Learn through interactive games, puzzles, and simulations. Earn tokens for your achievements!
          </p>
        </div>
        
        {isPlaying && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopGame}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <FaPause />
            <span>Stop Game</span>
          </motion.button>
        )}
      </div>

      {/* Game Selection */}
      {!activeGame && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-center">
                  <Icon className={`text-4xl text-${game.color}-500 mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {game.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium capitalize">{game.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="font-medium">{game.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Reward:</span>
                      <span className="font-medium text-green-600 flex items-center">
                        <FaCoins className="mr-1" />
                        {game.reward} tokens
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame(game.id)}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaPlay />
                    <span>Play Game</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Active Game */}
      {activeGame && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {getGameComponent()}
        </motion.div>
      )}

      {/* Game Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-purple-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FaTrophy className="text-gradient-orange mr-2" />
          Your Gaming Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{gamingStats.gamesPlayed}</div>
            <div className="text-sm text-purple-200">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{gamingStats.totalScore}</div>
            <div className="text-sm text-purple-200">Total Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{gamingStats.tokensEarned.toFixed(1)}</div>
            <div className="text-sm text-purple-200">Tokens Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{gamingStats.achievements}</div>
            <div className="text-sm text-purple-200">Achievements</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveGames;
