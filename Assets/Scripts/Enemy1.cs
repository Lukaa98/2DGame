using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class Enemy1 : MonoBehaviour
{
  [SerializeField] private GameObject _CloudParticlePrefab;


  public Ball1 ballobj = null;
   // public Ball1 ballobj1 = null;


  private void OnCollisionEnter2D(Collision2D collision) //Sent when an incoming collider makes contact 
                                                           //with this object's collider (2D physics only).
                                                           //the Code between braces will be executed when 
                                                           //two objects collides with each other
      { 
       

        Ball ball = collision.collider.GetComponent<Ball>();
        Ball1 ball1 = collision.collider.GetComponent<Ball1>();
       // Ball2 ball2 = collision.collider.GetComponent<Ball2>();

        //Enemy enemy = collision.collider.GetComponent<Enemy>();//if collision was not from the bird and maybe 

        if (ball != null || ball1 != null || collision.contacts[0].normal.y < -0.1/*||ball2 != null*/) //null means it does not exists
        {
          Instantiate(_CloudParticlePrefab,transform.position, Quaternion.identity);
            //Destroy(gameObject);
            FindObjectOfType<AudioManager>().Play("Crush");
            GetComponent<Rigidbody2D>().gravityScale = 1;


        }

         

      }
}