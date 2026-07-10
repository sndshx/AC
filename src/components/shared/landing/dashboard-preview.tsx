'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, Bot, Zap } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Dashboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-8 shadow-2xl"
      >
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Marketing Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400">Real-time insights and campaign performance</p>
          </div>
          <div className="flex space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Leads", value: "12,847", change: "+23%", icon: Users, color: "blue" },
            { label: "Conversion Rate", value: "8.4%", change: "+1.2%", icon: Target, color: "green" },
            { label: "Revenue", value: "$284K", change: "+15%", icon: TrendingUp, color: "purple" },
            { label: "AI Score", value: "94", change: "+2", icon: Bot, color: "orange" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                <span className="text-xs text-green-500 font-semibold">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Campaign Performance</h4>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-primary text-white rounded-full">7D</button>
              <button className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400">30D</button>
              <button className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400">90D</button>
            </div>
          </div>
          
          {/* Simulated Chart */}
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 400 120">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                d="M 0 80 Q 50 60 100 70 T 200 50 T 300 30 T 400 20"
                stroke="rgb(34 197 94)"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-sm"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
                d="M 0 100 Q 50 90 100 95 T 200 80 T 300 60 T 400 40"
                stroke="rgb(59 130 246)"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-sm"
              />
            </svg>
          </div>
          
          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Clicks</span>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Recommendations</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Increase budget on Campaign A by 15% for optimal ROI</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Adjust targeting for Campaign B to reach younger demographics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Launch retargeting campaign for cart abandoners</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <BarChart3 className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
      >
        <TrendingUp className="w-8 h-8 text-white" />
      </motion.div>
    </div>
  );
}