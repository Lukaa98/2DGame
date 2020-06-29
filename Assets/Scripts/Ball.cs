using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ball : MonoBehaviour
{
    private bool isPressed;
    private Rigidbody2D rb;

    private void Awake() 
    {
        rb = GetComponent<Rigidbody2D>();
    }


    // Update is called once per frame
    void Update()
    {
        if (isPressed) {
            DragBall();
        }
        
    }

    private void DragBall() 
    {
        Vector2 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        rb.position = mousePosition;
    }

    private void OnMouseDown()
    {
        isPressed = true;
        rb.isKinematic = true;

    }

    private void OnMouseUp()
    {
        isPressed = false;
                rb.isKinematic = true;


    }
}
