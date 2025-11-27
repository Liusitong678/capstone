import React from "react";
import { Link } from "react-router-dom";
import { FiTarget, FiHeart, FiUsers, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import "../styles/about.css";

export default function About() {
  return (
    <div className="jhc-about">
      <main>
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-inner">
            <p className="about-kicker">About JobHuntCopilot</p>
            <h1 className="about-title">
              We're here to make job hunting <span>less chaotic</span> and more <span>human</span>
            </h1>
            <p className="about-subtitle">
              JobHuntCopilot was born from a simple idea: job searching shouldn't feel overwhelming. 
              We built a tool that brings calm, clarity, and confidence to international job seekers.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-story">
          <div className="story-inner">
            <div className="story-grid">
              <div className="story-content">
                <h2>Our Story</h2>
                <p>
                  JobHuntCopilot started when our founders experienced the exhausting reality 
                  of job hunting as international candidates. Visa requirements, scattered job 
                  boards, messy spreadsheets, and endless applications—it felt like chaos.
                </p>
                <p>
                  We asked ourselves: what if job hunting could feel organized instead of overwhelming? 
                  What if you had one calm place for everything—AI-powered matching, resume help, 
                  and application tracking—all designed for international job seekers?
                </p>
                <p>
                  That's how JobHuntCopilot was born. Today, we help thousands of job seekers 
                  stay focused, organized, and confident as they search for roles where they 
                  can truly thrive.
                </p>
              </div>

              <div className="story-stats">
                <div className="stat-card">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Active Job Seekers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50,000+</div>
                  <div className="stat-label">Jobs Matched</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">User Satisfaction</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">30+</div>
                  <div className="stat-label">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="about-why">
          <div className="why-inner">
            <h2>Why We Built JobHuntCopilot</h2>
            <p className="why-subtitle">
              We recognized the fundamental challenges international job seekers face and designed 
              a comprehensive solution that transforms the job search experience.
            </p>
            
            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon-wrapper">
                  <div className="why-icon">
                    <FiCheckCircle />
                  </div>
                </div>
                <div className="why-content">
                  <h3>Centralized Application Management</h3>
                  <p>
                    Eliminate the complexity of managing multiple spreadsheets and disconnected tools. 
                    Our unified dashboard provides a single source of truth for tracking applications, 
                    interviews, follow-ups, and deadlines—ensuring nothing falls through the cracks.
                  </p>
                </div>
              </div>

              <div className="why-card">
                <div className="why-icon-wrapper">
                  <div className="why-icon why-icon-alt">
                    <FiTarget />
                  </div>
                </div>
                <div className="why-content">
                  <h3>Intelligent Job Matching</h3>
                  <p>
                    Save valuable time by focusing on opportunities that truly align with your profile. 
                    Our AI-powered matching engine evaluates your skills, experience, location preferences, 
                    and visa requirements to present roles where you're most likely to succeed.
                  </p>
                </div>
              </div>

              <div className="why-card">
                <div className="why-icon-wrapper">
                  <div className="why-icon why-icon-alt2">
                    <FiTrendingUp />
                  </div>
                </div>
                <div className="why-content">
                  <h3>AI-Enhanced Application Materials</h3>
                  <p>
                    Create compelling, tailored resumes and cover letters in minutes instead of hours. 
                    Our intelligent system analyzes job descriptions and provides personalized suggestions 
                    to help your application stand out while maintaining your authentic voice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="values-inner">
            <h2>What We Believe In</h2>
            <p className="values-subtitle">
              Our core values guide everything we build and every decision we make.
            </p>

            <div className="values-grid">
              <article className="value-card">
                <div className="value-icon-circle">
                  <FiHeart className="value-icon" />
                </div>
                <h3>Empathy First</h3>
                <p>
                  We understand the unique challenges international job seekers face. 
                  Every feature we build starts with empathy and a deep understanding 
                  of your journey.
                </p>
              </article>

              <article className="value-card">
                <div className="value-icon-circle value-icon-alt">
                  <FiTarget className="value-icon" />
                </div>
                <h3>Clarity & Simplicity</h3>
                <p>
                  Job hunting is complex enough. We cut through the noise to give you 
                  clear insights, simple tools, and a clutter-free experience.
                </p>
              </article>

              <article className="value-card">
                <div className="value-icon-circle value-icon-alt2">
                  <FiUsers className="value-icon" />
                </div>
                <h3>Community Driven</h3>
                <p>
                  Our users are at the heart of everything we do. We listen, learn, 
                  and continuously improve based on your feedback and needs.
                </p>
              </article>

              <article className="value-card">
                <div className="value-icon-circle value-icon-alt3">
                  <FiTrendingUp className="value-icon" />
                </div>
                <h3>Continuous Growth</h3>
                <p>
                  We're committed to evolving with the job market, adding new features, 
                  and helping you stay ahead in your career journey.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="mission-inner">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p className="mission-text">
                To give international job seekers one calm, organized place where they can 
                focus on what matters: finding roles that truly fit their skills, experience, 
                and visa situation.
              </p>
              <p className="mission-text">
                We believe everyone deserves a fair chance to showcase their talents, 
                regardless of where they're from. That's why we're building more than a 
                platform—we're building a kinder, smarter way to search for jobs.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="about-pricing">
          <div className="pricing-inner">
            <h2>Choose Your Plan</h2>
            <p className="pricing-subtitle">
              Start free and upgrade when you need more power. All plans include our core features.
            </p>

            <div className="pricing-grid">
              {/* Free Plan */}
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Free</h3>
                  <div className="pricing-price">
                    <span className="price-amount">$0</span>
                    <span className="price-period">/month</span>
                  </div>
                  <p className="pricing-desc">Perfect for getting started with your job search</p>
                </div>

                <ul className="pricing-features">
                  <li><FiCheckCircle /> Track up to 10 applications</li>
                  <li><FiCheckCircle /> Basic AI job matching</li>
                  <li><FiCheckCircle /> 1 resume version</li>
                  <li><FiCheckCircle /> Basic application dashboard</li>
                  <li><FiCheckCircle /> Email support</li>
                </ul>

                <Link to="/signup" className="pricing-btn pricing-btn-secondary">
                  Get Started Free
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="pricing-card pricing-card-featured">
                <div className="pricing-badge">Most Popular</div>
                <div className="pricing-header">
                  <h3>Pro</h3>
                  <div className="pricing-price">
                    <span className="price-amount">$19</span>
                    <span className="price-period">/month</span>
                  </div>
                  <p className="pricing-desc">For serious job seekers who want the full experience</p>
                </div>

                <ul className="pricing-features">
                  <li><FiCheckCircle /> Unlimited applications tracking</li>
                  <li><FiCheckCircle /> Advanced AI job matching</li>
                  <li><FiCheckCircle /> Unlimited resume versions</li>
                  <li><FiCheckCircle /> AI cover letter generator</li>
                  <li><FiCheckCircle /> Interview prep suggestions</li>
                  <li><FiCheckCircle /> Analytics & insights</li>
                  <li><FiCheckCircle /> Priority support</li>
                </ul>

                <Link to="/signup?plan=pro" className="pricing-btn pricing-btn-primary">
                  Upgrade to Pro
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Enterprise</h3>
                  <div className="pricing-price">
                    <span className="price-amount">Custom</span>
                  </div>
                  <p className="pricing-desc">For teams and organizations supporting multiple job seekers</p>
                </div>

                <ul className="pricing-features">
                  <li><FiCheckCircle /> Everything in Pro</li>
                  <li><FiCheckCircle /> Team management dashboard</li>
                  <li><FiCheckCircle /> Custom integrations</li>
                  <li><FiCheckCircle /> Dedicated account manager</li>
                  <li><FiCheckCircle /> Custom training sessions</li>
                  <li><FiCheckCircle /> SLA & priority support</li>
                </ul>

                <Link to="/contact?plan=enterprise" className="pricing-btn pricing-btn-secondary">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="cta-inner">
            <h2>Ready to bring calm to your job search?</h2>
            <p className="cta-text">
              Join thousands of international job seekers who've found clarity, 
              confidence, and their next career opportunity with JobHuntCopilot.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="cta-btn cta-btn-primary">
                Get Started Free
              </Link>
              <Link to="/contact" className="cta-btn cta-btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}