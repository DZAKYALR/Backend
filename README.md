# FlipCard
## API LIST
| ROUTES                    | METHODS | DESCRIPTION                    
|---------------------------|---------|--------------------------------
| `/login`                  | POST    | In Need To login user          
| `/register`               | POST    | In Need To register user          
| `/user/:id`               | GET     | In Need To see user data         
| `/cards`                  | POST    | In Need To add cards        
| `/cards`                  | GET     | In Need To see cards        
| `/cards/user/:id`         | GET     | In Need To see cards by it user_id       
| `/cards/category/:query`  | GET     | In Need To see cards by query       
| `/cards/title/:query`     | GET     | In Need To see cards by query       
| `/cards/:id`              | PUT     | In Need To update cards     
| `/cards/:id`              | DELETE  | In Need To delete tasks       

-------------------
## ERROR RESPONSE 
| STATUS |       ERROR DESC                 |
|--------|-------------------------         |
|   400  | SequelizeDatabaseError           |
|   401  | InvalidUser                      |
|   400  | SequelizeUniqueConstraintError   |
|   404  | ResourceNotFound                 |
|   400  | SequelizeValidationError         |
|   500  | Detailed Error Server            |

---------------------
## GUIDE
1. Clone this Repository
2. Install package based on package.json
3. create `.env` file with value that mentioned in description 
5. Sequelize migrate and seed
4. start node with `npm run dev`

-----
**POST /register**
----
 register into app.

* **URL**

  /register

* **Method:**

  `POST`
  
* **Req Body**

  **Required:**
  ```
    {
        "email": "<input email>",
        "password": "<input password>",
        "first_name ": "<input first_name>",
        "last_name": "<input last_name>",
    }
  ```
    

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ``` json
    {
        "id": "<given by system>",
        "email": "<email on database>",
        "first_name ": "<input first_name>",
        "last_name": "<input last_name>",
    }
 
* **Error Response:**

  * **Code:** 400 VALIDATION ERROR <br />
    **Content:** `{ SequelizeValidationError message }`
  
  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error messages }`
-----
-------
**POST /login**
----
 Login into app.

* **URL**

  /login

* **Method:**

  `POST`
  
* **Req Body**

  **Required:**
  ```
    {
        "email": "<input email>",
        "password": "<input password>",
    }
  ```
    

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ``` json
    {
        "access_token": "<given by system>",
    }
 
* **Error Response:**

  * **Code:** 400 VALIDATION ERROR <br />
    **Content:** `{ SequelizeValidationError message }`
  
  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ error messages }`
