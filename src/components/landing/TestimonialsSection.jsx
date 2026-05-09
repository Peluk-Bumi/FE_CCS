import React from "react";
import { FiArrowRight, FiStar, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialsSection({ theme, activeTestimonial, setActiveTestimonial }) {
  const testimonials = [
    {
      name: "Dr. Sari Wijaya",
      role: "Environmental Scientist",
      company: "Green Indonesia Foundation",
      content: "Platform ini benar-benar mengubah cara kami mengelola proyek konservasi. Interface yang intuitif dan fitur monitoring real-time sangat membantu!",
      avatar: FiUser,
      rating: 5,
      image: "/images/login-bg.jpg"
    },
    {
      name: "Budi Santoso",
      role: "Project Manager",
      company: "EcoTech Solutions",
      content: "Dengan AgroPariwisata, produktivitas tim kami meningkat 300%. Fitur kolaborasi dan AI-nya luar biasa!",
      avatar: FiUser,
      rating: 5,
      image: "/images/login-bg.jpg"
    },
    {
      name: "Maya Kusuma",
      role: "Research Director",
      company: "Marine Conservation NGO",
      content: "Tool terbaik untuk monitoring proyek marine conservation. Dashboard analytics-nya sangat comprehensive dan mudah dipahami.",
      avatar: FiUser,
      rating: 5,
      image: "/images/login-bg.jpg"
    }
  ];

  return (
    <section id="testimonials" className={`py-16 sm:py-24 md:py-28 relative overflow-hidden transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-green-950 via-gray-950 to-green-950'
        : 'bg-gradient-to-b from-white via-primary/30 to-white'
    }`}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FiStar className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Testimoni Pengguna</span>
          </motion.div>

          <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Apa Kata{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Pengguna Kami
            </span>
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto transition-colors ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Bergabunglah dengan <span className="font-bold text-primary">10,000+</span> profesional yang telah merasakan transformasi digital dalam konservasi
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-dark/5"></div>
                
                <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  {/* Left Side - Image */}
                  <div className="relative">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                      <motion.img
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].name}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    </div>

                    {/* Floating Stats */}
                    <motion.div
                      className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className="w-4 h-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">5.0</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Perfect Rating</p>
                    </motion.div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex flex-col justify-center">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl text-white">"</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1, type: "spring" }}
                        >
                          <FiStar className="w-6 h-6 text-amber-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Content */}
                    <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
                      "{testimonials[activeTestimonial].content}"
                    </blockquote>
                    
                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg">
                        {React.createElement(testimonials[activeTestimonial].avatar, { className: "w-7 h-7 text-white" })}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-primary">
                          {testimonials[activeTestimonial].name}
                        </div>
                        <div className="text-primary font-semibold text-sm">
                          {testimonials[activeTestimonial].role}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonials[activeTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className="relative group"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? "bg-gradient-to-r from-primary to-primary-dark w-10"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}></div>
                {index === activeTestimonial && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full blur-md opacity-50"
                    layoutId="activeDot"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Arrow Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <motion.button
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-12 h-12 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center pointer-events-auto hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiArrowRight className="w-5 h-5 rotate-180 text-gray-700" />
            </motion.button>
            <motion.button
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-12 h-12 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center pointer-events-auto hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiArrowRight className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
