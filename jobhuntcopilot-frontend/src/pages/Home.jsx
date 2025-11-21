// src/pages/Home.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import job from "../assets/job.jpg"
import bgHero from "../assets/bg-au.jpg";       // ✅ 背景大图
import "../styles/home.css";                   // 里面已经有 .app-bg, .app-content 的样式

const Home = () => {
  return (
    <div
      className="app-bg"                       // ✅ 毛玻璃背景容器
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      <div className="app-content">            {/* ✅ 真正内容放这里 */}
        <div className="home-root">
          <section className="home-hero">
            <Container>
              <Row className="align-items-center g-5">
                {/* 左侧文案 */}
                <Col lg={7} md={7} sm={12}>
                  <div className="hero-copy">
                    <p className="hero-kicker" aria-label="Project Category">
                      JobHunt Copilot · Capstone Project
                    </p>
                    <h1 className="hero-title">
                      Find the perfect
                      <br />
                      job for you
                    </h1>
                    <p className="hero-subtitle">
                      JobHunt Copilot is an AI-assisted job search tool that
                      helps you discover better matches, understand your
                      strengths, and stay organized while applying.
                    </p>

                    <ul className="hero-highlights" aria-label="Key Features">
                      {[
                        "Smart matching from multiple job sources",
                        "Quick resume insights and skill highlights",
                        "Simple dashboard to track every application",
                      ].map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>

                    <div className="hero-cta">
                      <Button
                        as={Link}
                        to="/login"
                        className="primary-cta"
                        aria-label="Sign In"
                      >
                        Sign in to try it
                      </Button>
                      <Button
                        as={Link}
                        to="/about"
                        variant="outline-primary"
                        className="secondary-cta"
                        aria-label="Learn More"
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>
                </Col>

                {/* 右侧整块背景图 */}
                <Col lg={5} md={5} sm={12} className="hero-bg-col">
                  <div className="hero-bg" />
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
