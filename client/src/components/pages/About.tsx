import React from "react";
import Experience from "../organisms/Experience";
import Education from "../organisms/Education";
import Skills from "../organisms/Skills";
import Contact from "../organisms/Contact";
import Summary from "../organisms/Summary";

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
