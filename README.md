# Vocabulary list
![image](https://github.com/nhat2520/vocabulary_list/assets/117809086/a3e7da8e-ff65-40af-9a07-84b091098fd1)
## About
Vocabulary List is an advanced website that employs cutting-edge artificial intelligence technology to meticulously analyze text. This site approaches the text and identifies the primary keywords, the significant terms within the text. Having determined these keywords, the website continues with its process to clearly and comprehensibly define each keyword. This is an excellent tool that aids users in accurately grasping the content and meaning of the text.
## Contributors
 Pham Long Nhat  - 22022520 <br>
 Nguyen Van Than - 22022596 <br>
 Tran Kim Dung   - 22022633
## Persona
**1. Ví dụ với một persona giáo viên:** <br>

**Tên:** Trịnh Trần Phương Tuấn <br>

**Tuổi:** 25 <br>

**Nghề Nghiệp:** Giáo viên Tiếng anh tại trường trung học phổ thông A<br>

**Sở thích:** Âm nhạc, đá bóng, du lịch <br>

**Kỹ năng:** Sử dụng đồ công nghệ, các sản phẩm công nghệ phục vụ cho giảng dạy<br>

**Mục tiêu:** Việc giải quyết các bài reading bằng cách dịch các từ vựng tỏ ra không hiệu quả vì học sinh sẽ khó hiểu được nội dung và bài đọc muốn truyền đạt vì thế thầy Tuấn sử dụng website này để giúp học sinh có một cách học tập Tiếng anh mới hiệu quả, dễ dàng hơn trong phần reading bằng cách chọn ra các từ khó hiểu trong bài đọc đó và đưa ra định nghĩa giải thích nó trong ngữ cảnh của văn bản đó.

**2. Ví dụ với một persona học sinh trung học:**

**Tên:** Thắng <br>

**Tuổi:** 17 <br>

**Nghề nghiệp:** Học sinh tại trường trung học phổ thông B <br>

**Sở thích:** Âm nhạc, đồ Ngọt, đọc sách <br>

**Kỹ năng:** Sử dụng thành thạo các sản phẩm công nghệ phục vụ cho học tập <br>

**Mục tiêu:** Là một người thích đọc sách, nhưng đôi khi, Thắng cảm thấy khó khăn khi gặp phải những từ khó và khó hiểu nó trong đoạn văn trong sách. Vì thế Thắng lựa chọn website Vocabulary_list để có thể hiểu được ý nghĩa có các từ khó đó trong ngữ cảnh đoạn văn. <br>
## Setup
0. Clone this repo:
```
git clone https://github.com/nhat2520/vocabulary_list.git
```
2. Install Docker and turn on it: <br>
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
## Run
1. Run web:
```
cd server
npm start
```
2. Access http://localhost:8080
## Authors:
Developed by team 16 
## Credits
Several packages were used in the software:
+ Nodejs
+ Ejs template view engine
+ Tailwind css
+ OpenAI
+ ...

