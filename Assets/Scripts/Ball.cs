﻿using System.Collections;
using System.Collections.Generic; 
using UnityEngine;
using UnityEngine.SceneManagement;

public class Ball : MonoBehaviour
{

    private bool isPressed;
    private bool isClicked = false;
    private float releaseDelay;
    private float maxDragDistance =  100f;
    private float _timeSittingAround;
    private bool _birdWasLaunched;
           public GameObject Bird;
               private LineRenderer lr; 
                public GameObject follow;
            
                        public GameObject follow1;







    private Rigidbody2D rb;
    private SpringJoint2D sj;
    private Rigidbody2D slingRb;
    private TrailRenderer tr;

    private void Awake() 
    {
                              //  FindObjectOfType<AudioManager>().Play("Theme");

        rb = GetComponent<Rigidbody2D>();
        sj = GetComponent<SpringJoint2D>();
        slingRb = sj.connectedBody;
        tr = GetComponent<TrailRenderer>();
                lr = GetComponent<LineRenderer>();

            //    follow1.GetComponent<followcomponent1>().enabled= false;
          follow.GetComponent<followcomponent>().enabled= true;




        tr.enabled = false;
                lr.enabled = false;



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
                     Bird.SetActive (false); 


           


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

              //  FindObjectOfType<AudioManager>().Play("Stretch");
                        FindObjectOfType<SoundEffects>().StretchSound();




        }
    }

    private void OnMouseUp()
    {

        if(!isClicked)
        {

        isPressed = false;
        rb.isKinematic = false;
                lr.enabled = false;

        StartCoroutine(Release());
        _birdWasLaunched = true;
        isClicked=true;

       // FindObjectOfType<AudioManager>().Play("Fly");
          FindObjectOfType<SoundEffects>().FlySound();

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
