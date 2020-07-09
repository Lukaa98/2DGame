using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Ball : MonoBehaviour
{
    private bool isPressed;
    private bool isClicked = false;
    private float releaseDelay;
    private float maxDragDistance = 15f;
    private float _timeSittingAround;
    private bool _birdWasLaunched;




    private Rigidbody2D rb;
    private SpringJoint2D sj;
    private Rigidbody2D slingRb;
    private LineRenderer lr;
    private TrailRenderer tr;

    private void Awake() 
    {
        rb = GetComponent<Rigidbody2D>();
        sj = GetComponent<SpringJoint2D>();
        slingRb = sj.connectedBody;
        lr = GetComponent<LineRenderer>();
        tr = GetComponent<TrailRenderer>();


        lr.enabled = false;
        tr.enabled = false;


        releaseDelay = 1/(sj.frequency * 4);




    }


    // Update is called once per frame
    public void Update()
    {
        if (isPressed) {
            DragBall();
        }

    if(_birdWasLaunched && GetComponent<Rigidbody2D>().velocity.magnitude <= 0.1)
    {
             _timeSittingAround += Time.deltaTime;
    }
    if(_timeSittingAround > 1)
    {
         FindObjectOfType<GameManager>().LevelLost();


    }

        
    }

    private void DragBall() 
    {
        SetLineRendererPositions();

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

    private void SetLineRendererPositions()
    {
        Vector3[] positions = new Vector3[2];
        positions[0] = rb.position;
        positions[1] = slingRb.position;
        lr.SetPositions(positions);
    }

    private void OnMouseDown()
    {
        if(!isClicked)
        {

        isPressed = true;
        rb.isKinematic = true;
        lr.enabled = true;
        }
    }

    private void OnMouseUp()
    {

        if(!isClicked)
        {

        isPressed = false;
        rb.isKinematic = false;
        StartCoroutine(Release());
        lr.enabled = false;
        _birdWasLaunched = true;
                isClicked=true;

        }



    }

    private IEnumerator Release()
    {
        if(!isClicked)
        {
        yield return new WaitForSeconds(releaseDelay);
        sj.enabled = false;
        tr.enabled = true;
        }

    }
}
