# Vocabulary list
![image](https://github.com/nhat2520/vocabulary_list/assets/120033344/b01999ae-4a03-4d95-9348-46d4a4c16838)


## About
Vocabulary List is an advanced website that employs cutting-edge artificial intelligence technology to meticulously analyze text. This site approaches the text and identifies the primary keywords, the significant terms within the text. Having determined these keywords, the website continues with its process to clearly and comprehensibly define each keyword. This is an excellent tool that aids users in accurately grasping the content and meaning of the text.
## Contributors
 Pham Long Nhat  - 22022520 <br>
 Nguyen Van Than - 22022596 <br>
 Tran Kim Dung   - 22022633
## Persona
**1. Example with a teacher persona:** <br>
   **Name:** Trinh Tran Phuong Tuan <br>
   **Age:** 25 <br>
**Occupation:** English teacher at high school A <br>
**Interests:** Music, soccer, traveling <br>
**Skills:** Using technology, technology products for teaching<br>
**Goal:** *Solving reading exercises by translating vocabulary is ineffective because students will have difficulty understanding the content and what the reading passage is trying to convey. Therefore, Mr. Tuan uses this website to help students learn English in a more effective and easier way in the reading section by selecting difficult words in the reading passage and providing definitions and explanations for them in the context of the text.<br>
**2. Example with a high school student persona:** <br>
**Name:** Thang<br>
**Age:** 17<br>
**Occupation:** Student at high school B <br>
**Interests:** Music, sweets, reading books <br>
**Skills:** Proficient in using technology products for studying <br>
**Goal:** As someone who enjoys reading books, sometimes Thang finds it difficult to understand challenging and unfamiliar words in passages. Therefore, Thang chooses the Vocabulary_list website to understand the meanings of those difficult words in the context of the passages<br>
## Setup
0. Clone this repo:
```
git clone https://github.com/nhat2520/vocabulary_list.git
```
1. Install Docker and turn on it: <br>
+ https://docs.docker.com/get-docker/
2. Install library: <br>
```
cd server
npm install 
```
3. Add environment variable file: <br>
Add the environment variable file .env into server folder and copy the content from the .env.examle file and fill in the remaining parameters<br>
4. Add file contain apikey: <br>
Add file apiKey.txt in folder API and add your apikey chatgpt into it <br>
5. Pull image database:<br>
```
cd server
docker-compose up
```
6. Create database by sequelize:
```
npx sequelize-cli db:migrate
```
## Run
1. Run web:
```
cd server
npm start
```
2. Access http://localhost:8080
## Authors:
Developed by team 16 
## Report and demo
Report: [Báo-cáo-công-nghệ-phần-mềm.pdf](https://github.com/nhat2520/vocabulary_list/files/15367286/Bao-cao-cong-ngh.-ph.n-m.m.pdf)  <br>
Demo: https://www.youtube.com/watch?v=Mi0KCDov1xA&ab_channel=Nh%E1%BA%ADtPh%E1%BA%A1m

## Credits
Several packages were used in the software:
+ Nodejs
+ Ejs template view engine
+ Tailwind css
+ OpenAI
+ ...

