import React from 'react';

const Contact = () => {
  const contributors = [
    {
      name: "M. Krishna Sairam",
      role: "99220040588",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=john&backgroundColor=b6e3f4",
      bio: "",
      email: "krishnasairammalapaka@gmail.com",
      linkedin: "https://www.linkedin.com/in/malapaka-krishna-sairam/"
    },
    {
      name: "N.V.V. Naga Sai",
      role: "99220041611",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=jane&backgroundColor=c0aede",
      bio: "",
      email: "nsai54817@gmail.com",
      linkedin: "https://www.linkedin.com/in/sirius-ar/"
    },
    {
      name: "M. Santhosh Sairam Kumar",
      role: "99220040115",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=mike&backgroundColor=ffdfbf",
      bio: "",
      email: "santhoshmanda259@gmail.com",
      linkedin: "https://www.linkedin.com/in/santhosh-reddy-manda-162b44255/"
    },
    {
      name: "J. Somanadh Chowdary",
      role: "99220041606",
      image: "https://api.dicebear.com/7.x/personas/svg?seed=sarah&backgroundColor=ffd5dc",
      bio: "",
      email: "somanadhjonnalagadda@gmail.com",
      linkedin: "https://www.linkedin.com/in/somanadh-jonnalagadda-337b25267/"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Team</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Meet the dedicated individuals behind our mission to make charitable giving more transparent and accessible through blockchain technology.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {contributors.map((contributor) => (
          <div key={contributor.name} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
              <img
                src={contributor.image}
                alt={contributor.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
            </div>
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800">{contributor.name}</h2>
              <p className="text-blue-600 text-sm mb-2">{contributor.role}</p>
              <p className="text-gray-600 text-sm mb-3">{contributor.bio}</p>
              <div className="flex justify-center space-x-3">
                <a
                  href={`mailto:${contributor.email}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="Email"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
                <a
                  href={contributor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact; 