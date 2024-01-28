import React from "react";
import Experience from "../../organisms/Experience/Experience";
import Education from "../../organisms/Education/Education";
import Skills from "../../organisms/Skills/Skills";
import Contact from "../../organisms/Contact/Contact";
import Summary from "../../organisms/Summary/Summary";
import "./style.css";

const About: React.FC = () => (
  <section className="about">
    <Summary />
    <Contact />
    <Experience />
    <Education />
    <Skills />
  </section>
);

export default About;
