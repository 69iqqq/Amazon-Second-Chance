"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle2, Loader2, ArrowLeft, UploadCloud } from "lucide-react";
import { enhanceProductImage } from '@/app/actions/imageEnhancement';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  brand: z.string().min(1, { message: "Brand is required." }),
  condition: z.string().min(1, { message: "Condition is required." }),
  originalPrice: z.string().min(1, { message: "Original price is required." }),
  sellingPrice: z.string().min(1, { message: "Selling price is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export default function AddProductPage() {
  const router = useRouter();
  const [imageState, setImageState] = useState<'idle' | 'uploaded' | 'enhancing' | 'enhanced'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string>('');
  const [enhancedUrl, setEnhancedUrl] = useState<string>('');
  const [geminiPrompt, setGeminiPrompt] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      brand: "",
      condition: "NEW",
      originalPrice: "",
      sellingPrice: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call to save product
    console.log(values);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/seller');
    }, 1500);
  }

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawImageUrl(event.target.result as string);
        setImageState('uploaded');
        setApiError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const enhanceImage = async () => {
    setImageState('enhancing');
    const values = form.getValues();
    const title = values.title || "Product";
    const condition = values.condition || "used";
    
    const result = await enhanceProductImage(rawImageUrl, title, condition);
    
    if (result.success && result.enhancedUrl) {
      setGeminiPrompt(result.geminiPrompt || '');
      setEnhancedUrl(result.enhancedUrl);
      // We don't set 'enhanced' state yet. We wait for the image to load.
    } else {
      setApiError(result.error || "Failed to enhance image");
      setImageState('uploaded');
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0F1111] font-sans pb-10">
      <div className="max-w-[1000px] mx-auto p-4 pt-6">
        
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/seller" className="text-[#007185] hover:text-[#c45500] flex items-center gap-1 text-[14px]">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Add a Product</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <Card className="rounded-md border-[#d5d9d9] shadow-sm">
              <CardHeader className="bg-[#f0f2f2] border-b border-[#d5d9d9] px-6 py-4">
                <CardTitle className="text-[16px] font-bold">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[13px]">Product Name / Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Apple iPhone 13 (128GB) - Midnight" className="border-[#d5d9d9] focus-visible:ring-[#007185]" {...field} />
                          </FormControl>
                          <FormMessage className="text-[#c40000] text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-[13px]">Brand</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Apple" className="border-[#d5d9d9] focus-visible:ring-[#007185]" {...field} />
                            </FormControl>
                            <FormMessage className="text-[#c40000] text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-[13px]">Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#d5d9d9] focus:ring-[#007185]">
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="NEW">New</SelectItem>
                                <SelectItem value="LIKE_NEW">Used - Like New</SelectItem>
                                <SelectItem value="VERY_GOOD">Used - Very Good</SelectItem>
                                <SelectItem value="GOOD">Used - Good</SelectItem>
                                <SelectItem value="ACCEPTABLE">Used - Acceptable</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[#c40000] text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-[13px]">Original Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" className="border-[#d5d9d9] focus-visible:ring-[#007185]" {...field} />
                            </FormControl>
                            <FormMessage className="text-[#c40000] text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-[13px]">Your Selling Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" className="border-[#d5d9d9] focus-visible:ring-[#007185]" {...field} />
                            </FormControl>
                            <FormMessage className="text-[#c40000] text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[13px]">Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the item, including any wear and tear..." 
                              className="min-h-[120px] border-[#d5d9d9] focus-visible:ring-[#007185]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-[#565959]">
                            Buyers depend on details. Be as accurate as possible.
                          </FormDescription>
                          <FormMessage className="text-[#c40000] text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 border-t border-[#f0f2f2] flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || imageState !== 'enhanced'}
                        className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] shadow-sm rounded-full px-6 font-medium h-9"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Save and Publish Listing
                      </Button>
                    </div>

                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: AI Image Enhancement */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="rounded-md border-[#d5d9d9] shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#1b1b1b] to-[#2c2c2c] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff9900]" />
                  <span className="font-bold text-[14px]">AI Photo Studio</span>
                </div>
                <span className="text-[10px] bg-[#ff9900] text-[#0f1111] px-2 py-0.5 rounded-sm font-bold">BETA</span>
              </div>
              <CardContent className="p-5">
                <p className="text-[12px] text-[#565959] mb-4">
                  Don't have a professional camera? Upload your raw photo and our AI will automatically enhance the lighting, remove the background, and upscale the resolution for a perfect Amazon-ready listing.
                </p>

                {/* Upload Area */}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                
                {/* Hidden image loader to preload the processing */}
                {imageState === 'enhancing' && enhancedUrl && (
                  <img 
                    src={enhancedUrl} 
                    alt="Preload" 
                    className="hidden" 
                    onLoad={() => setImageState('enhanced')}
                    onError={() => {
                      setApiError("Imagen 4 API failed to generate image.");
                      setImageState('uploaded');
                    }}
                  />
                )}

                <div className="border-2 border-dashed border-[#d5d9d9] rounded-md p-4 text-center relative transition-all bg-[#fafafa]">
                  {apiError && (
                    <div className="mb-4 bg-red-50 text-red-600 p-2 text-xs rounded border border-red-200">
                      {apiError}
                    </div>
                  )}

                  {imageState === 'idle' && (
                    <div className="flex flex-col items-center justify-center py-6 cursor-pointer" onClick={triggerUpload}>
                      <UploadCloud className="w-10 h-10 text-[#565959] mb-2" />
                      <span className="text-[13px] font-bold text-[#007185] hover:underline hover:text-[#c45500]">Click to upload</span>
                      <span className="text-[11px] text-[#565959]">or drag and drop</span>
                    </div>
                  )}

                  {imageState === 'uploaded' && (
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-[#e3e3e3] rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
                         {/* Raw photo placeholder */}
                         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${rawImageUrl}')` }}></div>
                         <span className="relative bg-black/50 text-white text-[10px] px-2 py-1 rounded-sm mt-auto mb-2">Raw Photo</span>
                      </div>
                      <Button 
                        onClick={enhanceImage}
                        className="w-full bg-[#111] hover:bg-[#000] text-white flex items-center gap-2 rounded-full h-9"
                      >
                        <Sparkles className="w-4 h-4 text-[#ff9900]" />
                        Enhance with AI
                      </Button>
                    </div>
                  )}

                  {imageState === 'enhancing' && (
                    <div className="flex flex-col items-center py-8">
                      <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#f0f2f2]"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-[#ff9900] border-t-transparent animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#ff9900] animate-pulse" />
                      </div>
                      <p className="text-[13px] font-bold text-[#0f1111] animate-pulse">Enhancing with AI...</p>
                      
                      {/* Fake Terminal Output to show "inbuilt prompt" */}
                      <div className="mt-4 w-full bg-[#111] rounded-md p-2 text-left">
                        <p className="text-[10px] text-green-400 font-mono mb-1">&gt; Compiling image context...</p>
                        {geminiPrompt && (
                          <>
                            <p className="text-[10px] text-green-400 font-mono mb-1">&gt; Sending to Imagen 4.0 Ultra Generate:</p>
                            <p className="text-[10px] text-gray-300 font-mono italic leading-tight">
                              "{geminiPrompt}"
                            </p>
                            <p className="text-[10px] text-blue-400 font-mono mt-1">&gt; Waiting for Imagen 4 to generate pixels... this takes 5-15s.</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {imageState === 'enhanced' && (
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white border border-[#d5d9d9] shadow-sm rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
                         {/* Enhanced photo placeholder */}
                         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${enhancedUrl}')` }}></div>
                      </div>
                      <div className="flex items-center gap-2 text-[#007600] text-[13px] font-bold bg-[#eef8ef] px-3 py-1.5 rounded-full border border-[#a3e5a3]">
                        <CheckCircle2 className="w-4 h-4" />
                        AI Enhancement Complete
                      </div>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border-[#d5d9d9] shadow-sm bg-[#f0f2f2]">
               <CardContent className="p-4 text-[12px] text-[#565959]">
                 <span className="font-bold text-[#0f1111]">Selling Tip:</span> High-quality images significantly improve conversion rates. The AI Image Enhancer ensures your used and refurbished items look as professional as brand new listings!
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
