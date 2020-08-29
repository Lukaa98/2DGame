using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class walk : MonoBehaviour
{

    private Rigidbody2D rb;
    private float dirx, diry, moveSpeed;

    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        moveSpeed = 5f;
        
    }

    // Update is called once per frame
    void Update()
    {
        dirx = Input.GetAxisRaw(" hor") * moveSpeed;
        diry = Input.GetAxisRaw(" ver" ) * moveSpeed;
 
    }
    private void FixedUpdate()
    {
        rb.velocity = new Vector2 (dirx, diry);
    }
}
