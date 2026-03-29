/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, PhoneOff, Activity, User, Briefcase, MapPin, PhoneCall } from 'lucide-react';
import { useLiveAPI } from './hooks/useLiveAPI';

export default function App() {
  const { isConnected, isConnecting, error, connect, disconnect } = useLiveAPI();

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-neutral-700">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-neutral-700 bg-neutral-800/50">
          <div className="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 relative">
            {isConnected && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping"></div>
            )}
            <User className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Nora</h1>
          <p className="text-indigo-400 text-sm font-medium mt-1">24/7 Front-Desk Specialist</p>
        </div>

        {/* Status Area */}
        <div className="p-8 text-center">
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center justify-center h-32">
            {isConnecting ? (
              <div className="flex flex-col items-center text-neutral-400">
                <Activity className="w-8 h-8 animate-pulse mb-2" />
                <p>Connecting to Nora...</p>
              </div>
            ) : isConnected ? (
              <div className="flex flex-col items-center text-emerald-400">
                <div className="flex gap-1 mb-3">
                  <div className="w-1.5 h-6 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                  <div className="w-1.5 h-8 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                  <div className="w-1.5 h-5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                  <div className="w-1.5 h-7 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_600ms]"></div>
                </div>
                <p className="font-medium">Call in progress</p>
                <p className="text-xs text-emerald-400/70 mt-1">Speak clearly into your microphone</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-neutral-400">
                <PhoneCall className="w-8 h-8 mb-2 opacity-50" />
                <p>Ready to receive calls</p>
                <p className="text-xs text-neutral-500 mt-2 max-w-[200px]">
                  Test Nora by acting as a customer with an emergency at 3 AM.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-neutral-900/50 flex justify-center gap-6">
          {!isConnected ? (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="w-7 h-7 fill-current" />
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-8 max-w-md w-full text-center">
        <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-4">Lead Capture Goals</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-neutral-300">Name</span>
          </div>
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-neutral-300">Phone</span>
          </div>
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-neutral-300">Service</span>
          </div>
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-neutral-300">Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
