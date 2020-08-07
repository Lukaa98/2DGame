using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class Enemy : MonoBehaviour
{
  [SerializeField] private GameObject _CloudParticlePrefab;

  public Ball ballobj = null;
    public Ball1 ballobj1 = null;

  public GameObject levelLost;
  public float EnemysToKill = 2f;
  private float killedago;


  private void OnCollisionEnter2D(Collision2D collision) //Sent when an incoming collider makes contact 
                                                           //with this object's collider (2D physics only).
                                                           //the Code between braces will be executed when 
                                                           //two objects collides with each other
      { 
       

        Ball ball = collision.collider.GetComponent<Ball>();
        Ball1 ball1 = collision.collider.GetComponent<Ball1>();

        //Enemy enemy = collision.collider.GetComponent<Enemy>();//if collision was not from the bird and maybe 

        if (ball != null || ball1 != null || collision.contacts[0].normal.y < -0.5) //null means it does not exists
        {
          Instantiate(_CloudParticlePrefab,transform.position, Quaternion.identity);
            Destroy(gameObject);
            Inventory.Reference.KilledEnemys += 1;
            FindObjectOfType<AudioManager>().Play("Crush");

        }

           
             if(Inventory.Reference.KilledEnemys >= EnemysToKill && ballobj != null && ballobj1 != null)
           { 
          
                      FindObjectOfType<GameManager>().LevelWon();
           }

      }
}