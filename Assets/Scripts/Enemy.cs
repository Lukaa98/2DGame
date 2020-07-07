﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Enemy : MonoBehaviour
{
   public GameObject levelLost;
    public GameObject NextLevel;
    private float _timeSittingAround;



    public float EnemysToKill = 2f;
    private void OnCollisionEnter2D(Collision2D collision) //Sent when an incoming collider makes contact 
                                                           //with this object's collider (2D physics only).
                                                           //the Code between braces will be executed when 
                                                           //two objects collides with each other
      { 
        
        Bird bird = collision.collider.GetComponent<Bird>();
        if (bird != null) //null means it does not exists
        {
            Destroy(gameObject);
            Inventory.Reference.KilledEnemys += 1;

           //SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);

          //  return;//if we hit object and in this case (mosnter) is destroyed, a return fucntion will end game
                    //insead of going to the next method which checks if box killed monster or not. 

        }
    

         Ball ball = collision.collider.GetComponent<Ball>();
        if (ball != null) //null means it does not exists
        {
            Destroy(gameObject);
            Inventory.Reference.KilledEnemys +=1;
        }

        Enemy enemy = collision.collider.GetComponent<Enemy>();//if collision was not from the bird and maybe 
                                                               // it was from the box and it hit from the top
                                                               //then end game as well
        if (enemy != null)
        {
            return;
        }
           if (collision.contacts[0].normal.y < -0.5)  //if we hit from the top
           {

               Destroy(gameObject);
               Inventory.Reference.KilledEnemys += 1;


           }


           if(Inventory.Reference.KilledEnemys > EnemysToKill)
           {

               Debug.Log("level won");

            

             NextLevel.SetActive(true);
             levelLost.SetActive(false);


            
            //SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);

           }

         Ball ball = collision.collider.GetComponent<Ball>();


         //  if(Inventory.Reference.KilledEnemys < EnemysToKill)
           //{

             //  Debug.Log("level lost");

            

             //levelLost.SetActive(false);


            
            //SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);

         //  }

        
      }

}
