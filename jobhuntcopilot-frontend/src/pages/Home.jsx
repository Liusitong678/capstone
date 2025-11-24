import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { FiSearch, FiFileText, FiTrendingUp } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import jobPic from "../assets/job2.jpg";

export default function Home() {
  return (
    <div className="jhc-home">
      <main>
        {/* HERO */}
        <section className="jhc-hero">
          <div className="jhc-hero-grid">
            <div className="jhc-hero-copy">
              <p className="hero-kicker">Smart job search, less chaos</p>
              <h1 className="hero-title">
                Find your next <span>dream job</span>
                <br />
                with <span>JobHuntCopilot</span>
              </h1>
              <p className="hero-subtitle">
                JobHuntCopilot helps you match jobs, polish your resume, and
                keep every application organized in one place.
              </p>

              <div className="hero-cta">
                <Link
                  to="/login"
                  className="hero-btn hero-btn-primary"
                  aria-label="Sign in"
                >
                  Sign in
                </Link>

                <Link
                  to="/about"
                  className="hero-btn hero-btn-ghost"
                  aria-label="Learn more"
                >
                  Learn more
                </Link>
              </div>

              <p className="hero-meta">
                AI-powered matching · Resume &amp; cover letter suggestions ·
                Application tracking
              </p>
            </div>

            <div className="jhc-hero-image-wrap">
              <img
                src={jobPic}
                alt="JobHuntCopilot dashboard preview"
                className="jhc-hero-image"
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="jhc-mid">
          <div className="mid-inner">
            <div className="mid-grid">
              {/* left */}
              <div className="mid-copy">
                <h2>How JobHuntCopilot fits into your job search</h2>
                <p className="mid-copy-text">
                  Instead of checking five different job boards and a messy Excel file,
                  JobHuntCopilot gives you one calm place to track everything.
                </p>

                <ul className="mid-list">
                  <li>• Focus on the roles that are actually a match.</li>
                  <li>• Keep your resumes, cover letters, and notes in one place.</li>
                  <li>• See your progress at a glance, instead of feeling lost.</li>
                </ul>
              </div>

              {/* 右侧 3 步流程时间轴 */}
              <div className="mid-steps">
                <div className="mid-step">
                  <div className="mid-step-circle">1</div>
                  <div className="mid-step-body">
                    <h3>Upload your resume</h3>
                    <p>We read your skills, tools, and experience to understand who you are.</p>
                  </div>
                </div>

                <div className="mid-step">
                  <div className="mid-step-circle">2</div>
                  <div className="mid-step-body">
                    <h3>Discover better matches</h3>
                    <p>See roles that align with your profile, location, and visa situation.</p>
                  </div>
                </div>

                <div className="mid-step">
                  <div className="mid-step-circle">3</div>
                  <div className="mid-step-body">
                    <h3>Track every application</h3>
                    <p>Move jobs through stages and keep notes so you always know what's next.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blue circular function introduction block */}
        <section className="jhc-intro">
          <div className="intro-inner">
            <h2>What JobHuntCopilot can do for you</h2>
            <p className="intro-subtitle">
              Designed for international job seekers who want a clear,
              organized, and kinder job-hunting experience.
            </p>

            <div className="intro-items">
              <article className="intro-item">
                <div className="intro-icon-circle">
                  <FiSearch className="intro-icon" />
                </div>
                <h3>Smart job matching</h3>
                <p>
                  We analyze your skills and preferences, then surface roles
                  that actually fit your background and visa situation.
                </p>
              </article>

              <article className="intro-item">
                <div className="intro-icon-circle intro-icon-alt">
                  <FiFileText className="intro-icon" />
                </div>
                <h3>Resume &amp; cover letter help</h3>
                <p>
                  Get AI suggestions to tailor your resume and generate
                  personalized cover letters in seconds.
                </p>
              </article>

              <article className="intro-item">
                <div className="intro-icon-circle intro-icon-alt2">
                  <FiTrendingUp className="intro-icon" />
                </div>
                <h3>Application tracking</h3>
                <p>
                  Keep all your applications, interview stages, and notes in one
                  simple dashboard, instead of ten messy spreadsheets.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="jhc-footer">
        <div className="footer-inner">

          {/* 左侧 Logo 和简介 */}
          <div className="footer-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">JH</div>
              <span className="footer-logo-text">JobHuntCopilot</span>
            </div>
            <p className="footer-desc">
              A calmer, smarter, and more organized way for international job seekers
              to track and manage their job search.
            </p>
          </div>

          {/* nav */}
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/jobs">Jobs</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* social media */}
          <div className="footer-social">
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <FaXTwitter />
            </a>

            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>

            <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </div>

        </div>

        {/* copyright */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} JobHuntCopilot — All rights reserved.
        </div>
      </footer>

    </div>
  );
}

