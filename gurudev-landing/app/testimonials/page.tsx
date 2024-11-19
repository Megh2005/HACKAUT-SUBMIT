import React from "react";

const testimonials = [
  {
    name: "John Doe",
    title: "Software Engineer",
    content: "Amazing experience!",
  },
  {
    name: "Jane Smith",
    title: "Product Manager",
    content: "Truly outstanding service!",
  },
  {
    name: "Michael Brown",
    title: "UI/UX Designer",
    content: "Exceeded my expectations.",
  },
  {
    name: "Alice Johnson",
    title: "Marketing Specialist",
    content: "Highly recommend!",
  },
  {
    name: "Chris Evans",
    title: "Data Scientist",
    content: "Absolutely fantastic!",
  },
  {
    name: "Emma Wilson",
    title: "Web Developer",
    content: "Top-notch quality!",
  },
  {
    name: "Olivia Davis",
    title: "Content Creator",
    content: "Unparalleled support!",
  },
  {
    name: "Liam Martinez",
    title: "DevOps Engineer",
    content: "Exceptional work!",
  },
  {
    name: "Sophia Garcia",
    title: "SEO Expert",
    content: "Brilliant execution!",
  },
  {
    name: "James Miller",
    title: "Photographer",
    content: "Incredible attention to detail!",
  },
  {
    name: "Mia White",
    title: "Videographer",
    content: "Impressive creativity!",
  },
  { name: "Noah Moore", title: "Freelancer", content: "Superb craftsmanship!" },
  {
    name: "Charlotte Taylor",
    title: "Startup Founder",
    content: "Phenomenal outcome!",
  },
  {
    name: "Benjamin Lee",
    title: "Business Analyst",
    content: "Very reliable!",
  },
  {
    name: "Amelia Harris",
    title: "Entrepreneur",
    content: "Absolutely loved it!",
  },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Gradient Heading */}
        <h1 className="text-4xl pb-8 font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-12">
          What People Are Saying
        </h1>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-2xl italic mb-4">{testimonial.content}</p>
              <div className="mt-4">
                <h3 className="text-xl text-pink-500 font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-gray-400">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
