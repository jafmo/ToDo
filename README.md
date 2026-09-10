Before running 
cd C:\projects\ToDoList\Web
npm install --force
Then build and run the app on visual studio 

if you face issues with modules, then try 
cd C:\projects\ToDoList\Web
rmdir /s /q node_modules
del package-lock.json
npm install --force

To run front-end tests
cd C:\projects\ToDoList\Web
npm test
