'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';

// Icons import
import { 
  Code2Icon, 
  PenToolIcon, 
  BrushIcon, 
  TrendingUpIcon,
  VideoIcon,
  AppWindowIcon,
  DatabaseIcon,
  CalendarIcon
} from 'lucide-react';

const formSchema = z.object({
  question: z.string().min(1, 'Please enter your question'),
  websiteType: z.string().min(1, 'Please specify website type'),
  reference: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  brandName: z.string().min(1, 'Brand name is required'),
  brandAge: z.string().min(1, 'Brand age is required'),
  brandDescription: z.string().min(1, 'Brand description is required'),
  hasDomain: z.enum(['Yes', 'No']),
  domainName: z.string().optional(),
  websitesUnderDomain: z.string().optional(),
  hasHosting: z.enum(['Yes', 'No']),
  needsLogo: z.enum(['Yes', 'No']),
  categoryPages: z.string().min(1, 'Number of category pages is required'),
  needsContent: z.enum(['Yes', 'No']),
  providingProductImages: z.enum(['Yes', 'No']),
  additionalRequirements: z.string().optional(),
  budget: z.string().min(1, 'Budget is required')
});

type FormData = z.infer<typeof formSchema>;

const services = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Website design, development, and maintenance.',
    icon: Code2Icon,
    color: 'bg-blue-500'
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'Writing, editing, and content marketing.',
    icon: PenToolIcon,
    color: 'bg-green-500'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Logo creation, branding, and visual design.',
    icon: BrushIcon,
    color: 'bg-purple-500'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'SEO, social media marketing, and advertising.',
    icon: TrendingUpIcon,
    color: 'bg-red-500'
  },
  {
    id: 'video-production',
    title: 'Video Production',
    description: 'Video creation, editing, and animation.',
    icon: VideoIcon,
    color: 'bg-yellow-500'
  },
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Custom software, mobile app development, and testing.',
    icon: AppWindowIcon,
    color: 'bg-indigo-500'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Data analysis, machine learning, and visualization.',
    icon: DatabaseIcon,
    color: 'bg-cyan-500'
  },
  {
    id: 'virtual-assistance',
    title: 'Virtual Assistance',
    description: 'Administrative support, email management, and scheduling.',
    icon: CalendarIcon,
    color: 'bg-pink-500'
  }
];

export default function FreelanceServicesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasDomain: 'No',
      hasHosting: 'No',
      needsLogo: 'No',
      needsContent: 'No',
      providingProductImages: 'No'
    }
  });

  const hasDomain = watch('hasDomain');

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/freelance/services/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Form submission error:', result);
        if (response.status === 400 && result.error === 'Email already exists') {
          toast.error(result.message || 'This email has already submitted a request');
          return;
        }
        if (response.status === 429) {
          toast.error(result.message || 'Too many submissions from your IP address');
          return;
        }
        if (result.error === 'Invalid form data' && result.details) {
          const errorMessages = result.details.map((err: any) => err.message).join(', ');
          toast.error(`Validation error: ${errorMessages}`);
          return;
        }
        toast.error(result.error || 'Failed to submit form. Please try again.');
        return;
      }

      toast.success('Form submitted successfully! We will contact you soon.');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Professional Freelance Services</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform your ideas into reality with our comprehensive freelance services. 
            From web development to content creation, we've got you covered.
          </p>
          <a 
            href="#request-form" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 
                     transition-colors duration-200 inline-block"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2Icon className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Development</h3>
              <p className="text-gray-600">Professional developers with years of experience in creating robust solutions.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Results Driven</h3>
              <p className="text-gray-600">Focus on delivering measurable results and achieving your business goals.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BrushIcon className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Creative Solutions</h3>
              <p className="text-gray-600">Innovative approaches to solve complex problems and create unique experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form Section */}
      <section id="request-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Request a Service</h2>
            <p className="text-xl text-gray-600">
              Tell us about your project requirements
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-black p-8 rounded-lg shadow-lg">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Tell us what you want</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type a question</label>
                  <textarea
                    {...register('question')}
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder="What kind of service are you looking for?"
                  />
                  {errors.question && (
                    <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website Type</label>
                  <input
                    {...register('websiteType')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="E-commerce, Portfolio, Business, etc."
                  />
                  {errors.websiteType && (
                    <p className="text-red-500 text-sm mt-1">{errors.websiteType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reference Website (Optional)</label>
                  <input
                    {...register('reference')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Any website you'd like us to reference"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Your Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    {...register('name')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    {...register('phoneNumber')}
                    type="tel"
                    placeholder="(000) 000-0000"
                    className="w-full p-3 border rounded-lg"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full p-3 border rounded-lg"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Brand Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand Name</label>
                  <input
                    {...register('brandName')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your brand name"
                  />
                  {errors.brandName && (
                    <p className="text-red-500 text-sm mt-1">{errors.brandName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand Age</label>
                  <input
                    {...register('brandAge')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="How long has your brand been active?"
                  />
                  {errors.brandAge && (
                    <p className="text-red-500 text-sm mt-1">{errors.brandAge.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand Description</label>
                  <textarea
                    {...register('brandDescription')}
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder="Tell us about your brand and its values"
                  />
                  {errors.brandDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.brandDescription.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Technical Requirements</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">1. Do you have a Domain?</label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register('hasDomain')}
                        value="Yes"
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register('hasDomain')}
                        value="No"
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {hasDomain === 'Yes' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Domain Name</label>
                      <input
                        {...register('domainName')}
                        className="w-full p-3 border rounded-lg"
                        placeholder="example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Websites Under Domain</label>
                      <input
                        {...register('websitesUnderDomain')}
                        className="w-full p-3 border rounded-lg"
                        placeholder="List any existing websites under this domain"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">2. Do you have a hosting service?</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('hasHosting')}
                          value="Yes"
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('hasHosting')}
                          value="No"
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">3. Do you need a logo?</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('needsLogo')}
                          value="Yes"
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('needsLogo')}
                          value="No"
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">4. Number of Category Pages</label>
                    <input
                      {...register('categoryPages')}
                      className="w-full p-3 border rounded-lg"
                      placeholder="e.g., 5, 10, 25"
                    />
                    {errors.categoryPages && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryPages.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">5. Do you need content creation?</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('needsContent')}
                          value="Yes"
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('needsContent')}
                          value="No"
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">6. Will you provide product images?</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('providingProductImages')}
                          value="Yes"
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register('providingProductImages')}
                          value="No"
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                  <textarea
                    {...register('additionalRequirements')}
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="Any specific requirements, preferences, or special features you'd like to include"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <input
                    {...register('budget')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your estimated budget for this project"
                  />
                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 
                         transition-colors duration-200 disabled:bg-blue-400 w-full md:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
} 