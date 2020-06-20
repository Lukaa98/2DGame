using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    private void OnCollisionEnter2D(Collision2D collision) //Sent when an incoming collider makes contact 
                                                           //with this object's collider (2D physics only).
                                                           //the Code between braces will be executed when 
                                                           //two objects collides with each other
       
        Bird bird = collision.collider.GetComponent<Bird>();
        if (bird != null) //null means it does not exists
        {
            Destory(gameObjcet);
        }

}
