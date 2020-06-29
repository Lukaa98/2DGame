using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ball : MonoBehaviour
{
    private bool isPressed;

    private float releaseDelay;
    private float maxDragDistance = 2f;


    private Rigidbody2D rb;
    private SpringJoint2D sj;
    private Rigidbody2D slingRb;

    private void Awake() 
    {
        rb = GetComponent<Rigidbody2D>();
        sj = GetComponent<SpringJoint2D>();
        slingRb = sj.connectedBody;

        releaseDelay = 1/(sj.frequency * 4);


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
        fload distance = Vector2.Distance(mousePosition, slingRb.position);

    }

    private void OnMouseDown()
    {
        isPressed = true;
        rb.isKinematic = true;

    }

    private void OnMouseUp()
    {
        isPressed = false;
        rb.isKinematic = false;
        StartCoroutine(Release());


    }

    private IEnumerator Release()
    {
        yield return new WaitForSeconds(releaseDelay);
        sj.enabled = false;
    }
}
