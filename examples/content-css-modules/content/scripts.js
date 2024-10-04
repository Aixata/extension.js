import './styles.css'
import styles from './Logo.module.css'
import logo from '../images/logo.png'

console.log('hello from content_scripts')

document.body.innerHTML += `
  <div class="content_script">
    <img class=${styles.content_logo} src="${logo}" />
    <h1 class="content_title">
      Welcome to your CSS Modules Extension
    </h1>
    <p class="content_description">
      Learn more about creating cross-browser extensions at <a
        className="underline hover:no-underline"
        href="https://extension.js.org"
        target="_blank"
      >
      https://extension.js.org
      </a>
    </p>
  </div>
  `