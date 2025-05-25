'use client';

import Image from 'next/image';
import { useState } from 'react';
import MainLayout from '../components/main_layout';

interface Course {
  title: string;
  rating: number;
  image: string;
  liked?: boolean;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Category', icon: '📁', color: 'bg-yellow-400' },
    { name: 'Boutique class', icon: '🎯', color: 'bg-green-400' },
    { name: 'Free course', icon: '📝', color: 'bg-blue-400' },
    { name: 'Bookstore', icon: '📚', color: 'bg-red-400' },
    { name: 'Live course', icon: '🎥', color: 'bg-purple-400' },
    { name: 'Leaderboard', icon: '🏆', color: 'bg-green-400' }
  ];

  const recommendedCourses: Course[] = [
    { title: 'Morning textbook', rating: 8.6, image: '/images/course1.jpg', liked: true },
    { title: 'English reading', rating: 8.0, image: '/images/course2.jpg' },
    { title: 'Illustration', rating: 7.5, image: '/images/course3.jpg' }
  ];

  return (
    <MainLayout appBarTitle='' showNavBar={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[430px] mx-auto px-4 pb-24">
          {/* Header */}
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-gray-900 text-xl font-bold">Home Page</h1>
              <p className="text-gray-500 text-sm mt-1">Choose your course <span className="text-green-500">right away</span></p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search for your grade, course, training type..."
              className="w-full py-3.5 px-12 bg-white rounded-2xl shadow-sm text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-[72px] h-[72px] ${category.color} rounded-full flex items-center justify-center mb-2 shadow-sm`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-sm text-center">{category.name}</span>
              </div>
            ))}
          </div>

          {/* Recommended Courses */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Recommended course</h2>
                <p className="text-sm text-gray-500 mt-1">you may also like 🎯</p>
              </div>
              <button className="text-gray-500 text-sm">More</button>
            </div>

            <div className="space-y-4">
              {recommendedCourses.map((course, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-[100px] h-[100px] bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-3 text-base">{course.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg font-bold mr-2">{course.rating}</span>
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(course.rating/2))}
                            {'☆'.repeat(5-Math.floor(course.rating/2))}
                          </div>
                        </div>
                        <button className={`text-2xl ${course.liked ? 'text-red-500' : 'text-gray-300'}`}>
                          {course.liked ? '♥' : '♡'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}