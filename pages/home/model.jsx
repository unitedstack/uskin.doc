import React from 'react';
import loginBg from './assets/logo-navbar.png';
import github from './assets/icon-github.png';
import computer from './assets/home-wp-computer.png';
import hand from './assets/home-wp-hand.png';
import coffee from './assets/home-wp-coffee.png';
import pencil from './assets/home-wp-pencil.png';
import mouse from './assets/home-wp-mouse.png';
import paper from './assets/home-wp-paper.png';
import puzzle from './assets/home-content-puzzle.png';
import paint from './assets/home-content-paint.png';
import person from './assets/home-content-person.png';

const Model = () => (
  <div>
    <div className="site-navbar">
      <div className="content">
        <a href="#">
          <img src={loginBg} alt="logo" />
        </a>
      </div>
    </div>
    <div className="site-home">
      <div className="welcome-page">
        <p className="title">
          <span className="head-title">Uskin</span>
          <span className="sub-title">React组件库及配色方案</span>
        </p>
        <div className="btn-area">
          <a href="docs.html" className="button green-button">开发指南</a>
          <a href="https://github.com/unitedstack/uskin.doc" className="button white-button">
            <img src={github} alt="github" className="icno-github" />GitHub
          </a>
        </div>
        <div className="stuff-area">
          <img src={computer} alt="" className="stuff wp-computer" />
          <img src={hand} alt="" className="stuff wp-hand" />
          <img src={coffee} alt="" className="stuff wp-coffee" />
          <img src={pencil} alt="" className="stuff wp-pencil" />
          <img src={mouse} alt="" className="stuff wp-mouse" />
          <img src={paper} alt="" className="stuff wp-paper" />
        </div>
      </div>
      <div className="content-page">
        <div className="content white-type">
          <div className="inner">
            <div className="img-area">
              <img src={puzzle} alt="" />
            </div>
            <div className="text-area">
              <p>包罗万象</p>
              <span>提供丰富多样的组件和组件模式，页面功能全能覆盖、繁简模式切换自如。</span>
            </div>
          </div>
        </div>
        <div className="content gray-type">
          <div className="inner">
            <div className="img-area">
              <img src={paint} alt="" />
            </div>
            <div className="text-area">
              <p>挥洒自如</p>
              <span>大方简洁的扁平化设计，配合色彩自由定义，组件与页面整体风格浑然天成、相得益彰。</span>
            </div>
          </div>
        </div>
        <div className="content white-type">
          <div className="inner">
            <div className="img-area">
              <img src={person} alt="" />
            </div>
            <div className="text-area">
              <p>身量小巧</p>
              <span>使用不着痕迹，React模块结构清晰，完整的文档、用例和单元测试助力开发。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="sit-bottom">
      <div className="github">
        <p className="github-p">
          <img src={github} alt="github" />
          <span>GitHub</span>
        </p>
        <ul className="github-links">
          <li><a href="#">Repository</a></li>
          <li><a href="#">Releases Note</a></li>
          <li><a href="#">Report Bug</a></li>
        </ul>
      </div>
      <p className="license">Copyright © 2017 MIT License</p>
    </div>
  </div>
);

export default Model;
