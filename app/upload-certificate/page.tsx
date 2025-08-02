'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { MinFloatingElements } from '@/components/ui/min-floating-elements';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function UploadCertificatePage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/upload-certificate/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuthenticated(true);
      console.log('Authenticated state set to true');
      setMessage(data.message);
    } else {
      setMessage(data.message);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    console.log('handleFileUpload function entered');

    e.preventDefault();
    setMessage('');
    if (!file) {
      setMessage('Please select a PDF file to upload.');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('email', email);
    formData.append('name', name);


    try {
      const res = await fetch('/api/upload-certificate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setShareableLink(data.shareableLink);
        setFile(null);
        setEmail('');
        setName('');
        setIsSuccessDialogOpen(true);
      } else {
        setMessage(data.message);
      }
    } catch (error: any) {
      console.error('Client-side upload error:', error);
      setMessage(`Upload failed: ${error.message || 'Unknown error'}`);
    }


    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#16556d] via-[#356a72] to-[#16556d] text-white overflow-hidden">
      <MinFloatingElements />
      <Navigation />

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Certificate Uploaded Successfully!</DialogTitle>
            <DialogDescription asChild>
              <span>
                The certificate has been uploaded and the recipient has been notified.
                {shareableLink && (
                  <span className="mt-2">
                    Shareable Link: <a href={shareableLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">{shareableLink}</a>
                  </span>
                )}
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <main className="flex-grow flex items-center justify-center p-4 pt-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-lg"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-white">Upload Certificate</h1>

          {!authenticated ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <Input
                  type="password"
                  id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="mt-1 block w-full glass-input placeholder-gray-400 text-black"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full glass-button bg-white/10 hover:bg-[#cdaa72]/20 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                Authenticate
              </Button>
              {message && <p className="text-center text-red-400 mt-4">{message}</p>}
            </form>
          ) : (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <Label htmlFor="certificateFile" className="text-white/80">Certificate PDF</Label>
                <input
                  type="file"
                  id="certificateFile"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full glass-input file:text-white file:bg-white/10 file:border-0 file:rounded-md file:py-2 file:px-4 file:mr-4 file:cursor-pointer hover:file:bg-white/20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-white/80">Recipient Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full glass-input placeholder-gray-400 text-black"
                  placeholder="Enter recipient's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white/80">Recipient Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full glass-input placeholder-gray-400 text-black"
                  placeholder="Enter recipient's email"
                  required
                />
              </div>
              <Button type="submit" className="w-full glass-button bg-white/10 hover:bg-[#cdaa72]/20 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Certificate'}
              </Button>
              {message && <p className="text-center text-green-400 mt-4">{message}</p>}
              {shareableLink && (
                <p className="text-center text-blue-400 mt-2">
                  Shareable Link: <a href={shareableLink} target="_blank" rel="noopener noreferrer" className="underline">{shareableLink}</a>
                </p>
              )}
            </form>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}