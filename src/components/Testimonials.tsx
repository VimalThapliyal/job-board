import React from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior React Developer",
    company: "TechFlow Solutions",
    content:
      "Found my dream job here in just 2 weeks! The job listings are always up-to-date and the application process was seamless. Highly recommend for any React developer looking for their next opportunity.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Frontend Team Lead",
    company: "InnovateCorp",
    content:
      "As a hiring manager, I've found some of our best React developers through this platform. The quality of candidates and the ease of posting jobs makes it my go-to resource for tech recruitment.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "React Developer",
    company: "RemoteFirst Inc",
    content:
      "The remote job opportunities here are incredible. I landed a fully remote position with a great salary and benefits. The platform's focus on React jobs makes it so much easier to find relevant opportunities.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "StartupXYZ",
    content:
      "After months of searching, I found the perfect React role here. The job descriptions are detailed and the companies are legit. The 6-hour update cycle means you're always seeing fresh opportunities.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "React Native Developer",
    company: "MobileFirst",
    content:
      "Switched from web development to React Native and found my niche here. The platform helped me discover companies that value both web and mobile React skills. Great community and resources!",
    rating: 5,
  },
  {
    id: 6,
    name: "Alex Johnson",
    role: "CTO",
    company: "ScaleUp Ventures",
    content:
      "We&apos;ve hired 5 React developers through this platform in the last year. The quality of candidates and the streamlined hiring process has been game-changing for our startup. Highly recommend for both employers and job seekers.",
    rating: 5,
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by React Developers Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of developers who have found their dream jobs and
            companies who have built amazing teams through our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Developers Hired</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Companies Hiring</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
