using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraClamp : MonoBehaviour
{
   [SerializeField]
   private Transform targetToFollow;
   

    // Update is called once per frame
    void Update()
    {
        transform.position = new Vector3
        (
            Mathf.Clamp(targetToFollow.position.x, -75f, 40f),
            Mathf.Clamp(targetToFollow.position.y, 83f, -40f),
            transform.position.z);

    
    }
}
