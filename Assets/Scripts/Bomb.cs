using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;


public class Bomb : MonoBehaviour
{
    

    public float fieldOfImpact;
    public float force;

    public LayerMask LayerToHit;
    // Start is called before the first frame update
   
    
    
  private void OnCollisionEnter2D(Collision2D collision) //Sent when an incoming collider makes contact 
{

        Bomb bomb = collision.collider.GetComponent<Bomb>();

        if (collision.contacts[0].normal.y < -0.5 )
        {
                Destroy(gameObject);
                Collider2D[] objects = Physics2D.OverlapCircleAll(transform.position,fieldOfImpact,LayerToHit);

                    foreach(Collider2D obj in objects)
                        {
                            Vector2 direction = obj.transform.position - transform.position;
                            obj.GetComponent<Rigidbody2D>().AddForce(direction * force);
                        }

        }
}




    void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position,fieldOfImpact);
    }


    
}
