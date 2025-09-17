import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuoteLeft, 
  FaStar, 
  FaGraduationCap,
  FaUserGraduate,
  FaAward,
  FaRocket
} from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Rural Maharashtra",
      course: "Python Programming",
      rating: 5,
      quote: "This platform changed my life! I never thought I could learn programming from my village. The blockchain certificates gave me confidence to apply for tech jobs in the city.",
      achievement: "Got hired as Junior Developer",
      avatar: "👩‍💻"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Rural Bihar",
      course: "Mathematics & Statistics",
      rating: 5,
      quote: "The token rewards system motivated me to complete every module. Now I'm helping other students in my village learn advanced mathematics.",
      achievement: "Became Math Tutor",
      avatar: "👨‍🏫"
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Rural Gujarat",
      course: "Science & Engineering",
      rating: 5,
      quote: "The blockchain verification made my certificates trustworthy. Employers were impressed that my achievements were cryptographically verified!",
      achievement: "Science Teacher",
      avatar: "👩‍🔬"
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Rural Punjab",
      course: "Complete STEM Program",
      rating: 5,
      quote: "From zero knowledge to earning 2000+ tokens! The progress tracking helped me stay motivated throughout my learning journey.",
      achievement: "STEM Coordinator",
      avatar: "👨‍🎓"
    },
    {
      id: 5,
      name: "Sunita Devi",
      location: "Rural Rajasthan",
      course: "Data Science",
      rating: 5,
      quote: "The decentralized learning approach was perfect for my remote location. I could learn at my own pace and verify my progress anytime.",
      achievement: "Data Analyst",
      avatar: "👩‍💼"
    },
    {
      id: 6,
      name: "Arjun Mehta",
      location: "Rural Karnataka",
      course: "Engineering Design",
      rating: 5,
      quote: "Blockchain technology in education is revolutionary! My certificates are now tamper-proof and globally recognized.",
      achievement: "Engineering Intern",
      avatar: "👨‍🔧"
    }
  ];

  const stats = [
    { icon: FaUserGraduate, number: "10,000+", label: "Students Enrolled" },
    { icon: FaAward, number: "25,000+", label: "Certificates Issued" },
    { icon: FaRocket, number: "95%", label: "Success Rate" },
    { icon: FaGraduationCap, number: "500+", label: "Rural Schools" }
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Success Stories from Rural India
          </h2>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Real students, real achievements, real impact. See how blockchain-verified STEM education 
            is transforming lives in rural communities across India.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-purple-500/20"
              >
                <Icon className="text-3xl text-gradient-orange mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-purple-200">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Quote */}
              <div className="mb-4">
                <FaQuoteLeft className="text-primary-300 text-xl mb-3" />
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>

              {/* Student Info */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              {/* Course & Achievement */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Course:</span> {testimonial.course}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  <span className="font-medium">Achievement:</span> {testimonial.achievement}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your STEM Journey?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of students who are transforming their futures with blockchain-verified education.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
