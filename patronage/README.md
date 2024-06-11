<!-- Project Info -->
<br>

![GitHub repo size](https://img.shields.io/github/repo-size/Pantonym/DV300Term2)
![GitHub watchers](https://img.shields.io/github/watchers/Pantonym/DV300Term2)
![GitHub language count](https://img.shields.io/github/languages/count/Pantonym/DV300Term2)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Pantonym/DV300Term2)

<!-- Logo and link to repository -->
<p align="center">
  <a href="https://github.com/Pantonym/DV300Term2">
    <img src="patronage/assets/readmeAssets/Logo.jpg" width="100px">
  </a>
</p>

<!-- Short Description -->
<h3 align="center">Patronage: Writing Competitions Made Easy</h3>
<p align="center"> This is a writing competition manager mobile application utilizing Firebase
    <br>
    <!-- Bug and New Feature Links -->
    <a href="https://github.com/Pantonym/DV300Term2/issues">Report Bug</a>
    <a href="https://github.com/Pantonym/DV300Term2/issues">Request Feature</a>
    <br>
</p>

<!-- Name and Number In Alphabetical Order -->
<div>
    <h5 align="center" style="padding:0;margin:0;">Nico van Wyk</h5>
    <h5 align="center" style="padding:0;margin:0;">Student Number: 221179</h5>
    <br>
</div>
<!-- Subject and Term -->
<h6 align="center">DV300 | Term 2</h6>

<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About the Project](#about-the-project)
  - [Mockup](#mockup)
  - [Project Description](#project-description)
  - [Technologies Used](#technologies-used)
  - [Built With](#built-with)
    - [React Native](#react-native)
    - [Expo](#expo)
    - [Firebase/Firestore](#firebasefirestore)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Features and Functionality](#features-and-functionality)
- [Development Process](#development-process)
  - [Architecture](#architecture)
  - [Design Frame](#design-frame)
  - [Solution](#solution)
  - [Theme](#theme)
  - [Development Documents](#development-documents)
    - [Highlights](#highlights)
    - [Challenges](#challenges)
  - [Future Implementation](#future-implementation)
- [Final Outcome](#final-outcome)
  - [Mockups](#mockups)
  - [Video Demonstration](#video-demonstration)
- [License](#license)
- [Authors](#authors)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)
- [References](#references)

<!-- About the Project -->
## About the Project

<!-- Mockup -->
<!-- TODO: ADD MOCKUP -->
### Mockup
<img src="spynet/src/assets/readmeAssets/" alt="Mockup" style="height: 600px"/>

<!--PROJECT DESCRIPTION-->
### Project Description
Patronage is a competition management mobile application where users can write stories of different genres and upload them to a leaderboard. They can then read and vote on their favourite stories using a scale of 1-10 to show how much they enjoyed each story.
### Technologies Used
* React Native
* Expo
* Firebase/Firestore

### Built With
<!-- React Native -->
#### React Native
* A JavaScript library used to build the frontend of the application.
* Uses components to render the front end.
* Used for cross-platform development.
<p>React Native was used to build the front end.</p>
<!-- TODO: React Native logo -->
<img src="spynet/src/assets/readmeAssets/" alt="TS_Logo" style="width: 300px; height: auto;" />

<!-- Expo -->
#### Expo
* Open source framework.
* Allows apps to be created for multiple platforms, even including web.
* Used as a cross-platform framework, as well as for testing through ExpoGo.
<p>Expo was used to test the website, as well as allow it to be cross-platform</p>
<img src="spynet/src/assets/readmeAssets/" alt="AJAX-Logo" style="width: 400px; height: 225px;"/>

<!-- Firebase/Firestore -->
#### Firebase/Firestore
* Cloud Computing Service used to create the backend of the application.
* JavaScript was used to contact it.
* Is a NoSQL database.
* Firebase was used for text-based data and Firestore was used for images.
<p>Firebase/Firestore was used to implement backend functionality to implement CRUD functionality to the application.</p>
<img src="spynet/src/assets/readmeAssets/" alt="Bootstrap-Logo" style="width: 400px; height: auto;"/>

<!-- GETTING STARTED -->
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
For development and testing, the latest version of Node.js is required, which is available here: [Node.js](https://nodejs.org/en).

### Installation
Here are a couple of ways to clone this repo:

1.  GitHub Desktop </br>
    Enter `https://github.com/Pantonym/DV300Term2.git` into the URL field and press the `Clone` button.

2.  Clone Repository </br>
    Run the following in the command-line to clone the project:

    ```sh
    git clone https://github.com/Pantonym/DV300Term2.git
    ```
The following installations are required if you do not clone the repository:
* Click on Terminal and open a new terminal
* Install Dependencies:
1. npm install
* Start Application:
1. npm start
* List of Dependencies:
1. npm install expo-status-bar@~1.12.1 
2. npm install react-native@0.74.1
3. npm install expo@latest
4. npm install @react-navigation/native-stack
5. npm install @react-navigation/native
6. npm install react-native-screens react-native-safe-area-context
7. npm install firebase
8. npm install expo-font
9. npm install react-native-reanimated
10. npm install @react-native-picker/picker
11. npm install @react-native-async-storage/async-storage
12. npm install expo-image-picker
13. npm install react-native-uuid

<!-- Main Features and Functionality -->
## Features and Functionality
1. Feature/Function
* Description `specific` file.
`code`

* Additional Information
`return inject(AuthService).checkCurrentUserLoggedIn()`
`  // if it is true, leave it as-is`
`  ? true`
`  // otherwise, redirect to "/login"`
`  : inject(Router).createUrlTree(['/login']);`

<!-- Development PROCESS -->
## Development Process
### Architecture
The application consists of multiple React Native pages and components. It communicates with a NoSQL database to receive and send information. `Firebase.js` was created to contact the database, and service files handled functionality.
### Design Frame
How might we...?
### Solution
Patronage...
### Theme
Discuss Theme

### Development Documents
<!-- Moodboard -->
* Moodboard
<img src="spynet/src/assets/readmeAssets/" alt="Moodboard" style="height: 600px">

<!-- Iconography -->
* Iconography
<img src="spynet/src/assets/readmeAssets/" alt="Iconography" style="height: 200px">

<!-- Colour Palette -->
* Colour Palette
<img src="spynet/src/assets/readmeAssets/" alt="Colour Palette" style="height: 100px">

<!-- Data Planning - ERD -->
* Data Planning - ERD
<img src="spynet/src/assets/readmeAssets/" alt="Data Planning - ERD" style="height: 300px">

<!-- Wireframes -->
* Wireframes
Name Page
<img src="spynet/src/assets/readmeAssets/" alt="Login" style="width: 600px"/>
Name Page
<img src="spynet/src/assets/readmeAssets/" alt="Dashboard" style="width: 600px"/>

<!-- Highlights -->
#### Highlights
* Highlight
* Highlight
* Highlight
* Highlight
* Highlight

<!-- Challenges -->
<!-- Explain the challenges faced with the project and why you think you faced it or how you think you'll solve it (if not solved), or how you solved it -->
#### Challenges
* Challenge
* Challenge
* Challenge
* Challenge
* Challenge

<!-- Future Implementation -->
### Future Implementation
* Implementation 
* Implementation
* Implementation
* Implementation
* Implementation

<!-- Final Outcome -->
## Final Outcome
<!-- MOCKUPS -->
### Mockups
<img src="spynet/src/assets/readmeAssets/" alt="Mockup" style="height: 600px"/>
<img src="spynet/src/assets/readmeAssets/" alt="Mockup" style="height: 600px"/>
<img src="spynet/src/assets/readmeAssets/" alt="Mockup" style="height: 600px"/>
<img src="spynet/src/assets/readmeAssets/" alt="Mockup" style="height: 600px"/>

<br>

<!-- Video Demonstration -->
### Video Demonstration
**Video Demonstration:** <a href="">Google Drive Link</a>

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.

<!-- AUTHORS -->
## Authors
* **Nico van Wyk** - [Github](https://github.com/Pantonym)

<!-- Contact -->
## Contact
**Nico van Wyk** - [221179@virtualwindow.co.za](mailto:221179@virtualwindow.co.za)

<!-- ACKNOWLEDGEMENTS -->
<!-- all resources that you used and Acknowledgements here -->
## Acknowledgements
* [Lecturer](https://github.com/ArmandPretorius)
* [Figma](https://www.figma.com/)
* [W3Schools](https://www.w3schools.com)

## References
* Link (Title)
* Link (Title)
* Link (Title)