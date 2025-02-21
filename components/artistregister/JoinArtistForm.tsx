"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";

export default function JoinArtistForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", form);
    // TODO: Connect to Supabase or backend
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Join as an Artist 🎨
          </CardTitle>
          <p className="text-gray-500 text-center text-sm">
            Showcase your talent & start selling on CraftID.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
            <Input
              name="portfolio"
              placeholder="Portfolio/Website (Optional)"
              value={form.portfolio}
              onChange={handleChange}
              className="rounded-xl"
            />
            <Textarea
              name="bio"
              placeholder="Tell us about your art journey..."
              value={form.bio}
              onChange={handleChange}
              required
              className="rounded-xl"
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full text-lg py-2 rounded-xl">
                Apply Now 🚀
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
