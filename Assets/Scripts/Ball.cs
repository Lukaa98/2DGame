using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ball : MonoBehaviour
{
    private bool isPressed;

    private float releaseDelay;
    private float maxDragDistance = 10f;


    private Rigidbody2D rb;
    private SpringJoint2D sj;
    private Rigidbody2D slingRb;
    private LineRenderer lr;

    private void Awake() 
    {
        rb = GetComponent<Rigidbody2D>();
        sj = GetComponent<SpringJoint2D>();
        slingRb = sj.connectedBody;
        lr = GetComponent<LineRenderer>();

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
        SetLineRendererPosition();
        Vector2 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        float distance = Vector2.Distance(mousePosition, slingRb.position);

        if (distance > maxDragDistance)
        {
            Vector2 direction = (mousePosition - slingRb.position).normalized;
            rb.position = slingRb.position + direction * maxDragDistance;
        }
            
        else {
                rb.position = mousePosition;
             }
        }

    private void SetLineRendererPosition()
    {
        Vector3[] positions = new Vector3[2];
        positions[0] = rb.position;
        position[1] = hookRb.position;
        lr.SetPosition(positions);
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
