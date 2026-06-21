'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Square, Radio, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEndPodcastMutation } from '../../../../services/allApi';

// const defaultServer = 'http://10.10.20.73:5005';
const defaultServer = 'https://api.pg-65.com';

export default function BroadcasterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const [endPodcast, { isLoading: isEnding }] = useEndPodcastMutation();

  const [podcastId, setPodcastId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [listenerCount, setListenerCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chunkCount, setChunkCount] = useState(0);

  // Initial Setup & State Recovery
  useEffect(() => {
    const pid = searchParams.get('podcastId');
    const sid = searchParams.get('sessionId');
    if (pid) setPodcastId(pid);
    if (sid) setSessionId(sid);

    // Socket Initialization
    const socket = io(`${defaultServer}/podcast`, {
      transports: ['websocket'],
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      if (pid) {
        socket.emit('join-podcast', { podcastId: pid, role: 'broadcaster' });

        const wasLive = localStorage.getItem(`podcast_live_${pid}`);
        if (wasLive === 'true') {
          setIsBroadcasting(true);
          startBroadcast(true);
        }
      }
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('listener-update', (data: { currentListeners: number }) => {
      setListenerCount(data.currentListeners || 0);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [searchParams]);

  const startBroadcast = async (isResume = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = recorder;

      let isFirstChunk = true;

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && socketRef.current?.connected) {
          const buffer = await event.data.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

          socketRef.current.emit('broadcast-audio', {
            podcastId: searchParams.get('podcastId') || podcastId,
            sessionId: searchParams.get('sessionId') || sessionId,
            audioChunk: base64,
            mimeType: mimeType,
            isHeader: isFirstChunk,
          });

          isFirstChunk = false;
          setChunkCount((c) => c + 1);
        }
      };

      recorder.start(1000);
      setIsBroadcasting(true);

      const pid = searchParams.get('podcastId') || podcastId;
      if (pid) localStorage.setItem(`podcast_live_${pid}`, 'true');

      if (!isResume) toast.success('Broadcast is Live!');
    } catch (err: any) {
      console.error(err);
      if (isResume) {
        toast.info('Session resumed. Please check microphone.');
      } else {
        toast.error('Could not start broadcast. Check mic permissions.');
      }
    }
  };

  const stopBroadcast = async () => {
    try {
      mediaRecorderRef.current?.stop();
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());

      setIsBroadcasting(false);
      setChunkCount(0);

      if (podcastId) {
        localStorage.removeItem(`podcast_live_${podcastId}`);
        await endPodcast(podcastId).unwrap();
        toast.success('Session Ended');
        router.push('/manage-podcasts');
      }
    } catch {
      toast.error('Error ending session');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 font-sans lg:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold text-slate-400 transition-all hover:text-slate-900"
          >
            <ArrowLeft size={20} /> Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-3 rounded-2xl border px-5 py-2.5 text-sm font-black tracking-widest uppercase shadow-sm transition-all ${
                isBroadcasting
                  ? 'animate-pulse border-red-700 bg-red-600 text-white'
                  : isConnected
                    ? 'border-green-200 bg-green-100 text-green-700'
                    : 'border-slate-300 bg-slate-200 text-slate-500'
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isBroadcasting ? 'bg-white' : isConnected ? 'bg-green-500' : 'bg-slate-400'
                }`}
              />
              {isBroadcasting ? 'Live' : isConnected ? 'Connected' : 'Offline'}
            </div>
          </div>
        </header>

        <div className="w-full">
          <div className="overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200">
            <div className="p-8 md:p-12">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    On-Air Studio
                  </h1>
                  <p className="font-medium text-slate-500">
                    Professional Audio Broadcasting Environment
                  </p>
                </div>
                <ShieldCheck className="hidden text-indigo-500 md:block" size={40} />
              </div>

              {/* Visualizer */}
              <div className="relative mb-12 flex h-72 items-center justify-center rounded-[2.5rem] bg-slate-950 shadow-inner">
                {isBroadcasting && !isMuted ? (
                  <div className="flex h-32 items-end gap-1.5">
                    {[...Array(40)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 animate-bounce rounded-full bg-indigo-500"
                        style={{
                          animationDuration: `${0.3 + Math.random()}s`,
                          height: `${15 + Math.random() * 85}%`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 ring-4 ring-slate-800">
                      <MicOff size={40} className="text-slate-600" />
                    </div>
                    <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                      Microphone Standby
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-5">
                {!isBroadcasting ? (
                  <button
                    onClick={() => startBroadcast(false)}
                    className="flex flex-1 items-center justify-center gap-4 rounded-3xl bg-indigo-600 py-7 text-2xl font-black text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.97]"
                  >
                    <Radio size={32} /> GO LIVE
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (audioStreamRef.current) {
                          audioStreamRef.current.getAudioTracks()[0].enabled = isMuted;
                          setIsMuted(!isMuted);
                        }
                      }}
                      className={`flex h-24 w-24 items-center justify-center rounded-3xl shadow-lg transition-all ${
                        isMuted
                          ? 'bg-red-500 text-white shadow-red-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isMuted ? <MicOff size={36} /> : <Mic size={36} />}
                    </button>

                    <button
                      onClick={stopBroadcast}
                      disabled={isEnding}
                      className="flex flex-1 items-center justify-center gap-4 rounded-3xl bg-slate-900 py-7 text-2xl font-black text-white shadow-2xl transition-all hover:bg-black disabled:opacity-50"
                    >
                      {isEnding ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Square size={28} fill="currentColor" />
                      )}
                      STOP SESSION
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
