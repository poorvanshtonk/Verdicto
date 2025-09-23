import React, { useState } from 'react';
import { ArrowLeft, Star, CheckCircle, User, Building } from './icons';

interface PricingPageProps {
  onBack: () => void;
}

type BillingCycle = 'monthly' | 'yearly';

const PlanFeature: React.FC<{ children: React.ReactNode; isAvailable: boolean }> = ({ children, isAvailable }) => (
  <li className={`flex items-center gap-3 ${isAvailable ? 'text-gray-800' : 'text-gray-400'}`}>
    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isAvailable ? 'text-brand-secondary' : 'text-gray-300'}`} />
    <span>{children}</span>
  </li>
);

export const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 px-4 py-2 text-brand-primary font-semibold hover:bg-blue-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">
                        Find the Right Plan for You
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Unlock powerful features to streamline your legal analysis, save time, and gain peace of mind.
                    </p>
                    <div className="mt-6 flex justify-center items-center gap-4">
                        <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-brand-primary' : 'text-gray-500'}`}>Monthly</span>
                        <button 
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${billingCycle === 'yearly' ? 'bg-brand-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></span>
                        </button>
                        <span className={`font-semibold ${billingCycle === 'yearly' ? 'text-brand-primary' : 'text-gray-500'}`}>Yearly</span>
                        <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">Save 20%</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <div className="border rounded-xl p-6 flex flex-col">
                        <User className="w-8 h-8 text-brand-primary mb-4" />
                        <h3 className="text-2xl font-bold text-brand-dark">Free</h3>
                        <p className="text-gray-500 mt-2 mb-4">For individuals getting started with AI legal analysis.</p>
                        <p className="text-4xl font-extrabold text-brand-dark mb-6">
                            $0<span className="text-base font-normal text-gray-500">/month</span>
                        </p>
                        <button className="w-full py-3 px-4 bg-gray-200 text-gray-800 font-bold rounded-lg">
                            Your Current Plan
                        </button>
                        <ul className="space-y-3 mt-8 text-sm flex-grow">
                           <PlanFeature isAvailable={true}>5 Document Analyses / month</PlanFeature>
                           <PlanFeature isAvailable={true}>Standard AI Model</PlanFeature>
                           <PlanFeature isAvailable={true}>Save to Secure Workspace</PlanFeature>
                           <PlanFeature isAvailable={false}>E-Signature Integration</PlanFeature>
                           <PlanFeature isAvailable={false}>Developer API Access</PlanFeature>
                           <PlanFeature isAvailable={false}>Priority Support</PlanFeature>
                        </ul>
                    </div>
                    
                    {/* Pro Plan */}
                    <div className="border-2 border-brand-primary rounded-xl p-6 flex flex-col relative overflow-hidden">
                        <span className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-4 py-1 rounded-bl-lg">Most Popular</span>
                        <Star className="w-8 h-8 text-yellow-500 mb-4" />
                        <h3 className="text-2xl font-bold text-brand-dark">Pro</h3>
                        <p className="text-gray-500 mt-2 mb-4">For professionals who need unlimited access and premium features.</p>
                        <p className="text-4xl font-extrabold text-brand-dark mb-6">
                            ${billingCycle === 'monthly' ? '29' : '23'}<span className="text-base font-normal text-gray-500">/month</span>
                        </p>
                        <button className="w-full py-3 px-4 bg-brand-secondary text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                            Upgrade to Pro
                        </button>
                        <ul className="space-y-3 mt-8 text-sm flex-grow">
                           <PlanFeature isAvailable={true}>Unlimited Document Analyses</PlanFeature>
                           <PlanFeature isAvailable={true}>Advanced AI Model</PlanFeature>
                           <PlanFeature isAvailable={true}>Save to Secure Workspace</PlanFeature>
                           <PlanFeature isAvailable={true}>E-Signature Integration</PlanFeature>
                           <PlanFeature isAvailable={true}>Developer API Access</PlanFeature>
                           <PlanFeature isAvailable={true}>Priority Support</PlanFeature>
                        </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="border rounded-xl p-6 flex flex-col">
                        <Building className="w-8 h-8 text-brand-primary mb-4" />
                        <h3 className="text-2xl font-bold text-brand-dark">Enterprise</h3>
                        <p className="text-gray-500 mt-2 mb-4">For teams and organizations with custom needs.</p>
                        <p className="text-4xl font-extrabold text-brand-dark mb-6">
                            Custom
                        </p>
                        <button className="w-full py-3 px-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">
                            Contact Sales
                        </button>
                         <ul className="space-y-3 mt-8 text-sm flex-grow">
                           <PlanFeature isAvailable={true}>Everything in Pro, plus:</PlanFeature>
                           <PlanFeature isAvailable={true}>Team Management & SSO</PlanFeature>
                           <PlanFeature isAvailable={true}>Custom Document Templates</PlanFeature>
                           <PlanFeature isAvailable={true}>On-premise Deployment Options</PlanFeature>
                           <PlanFeature isAvailable={true}>Dedicated Account Manager</PlanFeature>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
