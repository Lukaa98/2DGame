using UnityEngine;

public class followcomponent1 : MonoBehaviour
{
  public Transform targetToFollow;
  //public Transform targetToFollow2;
  //public Transform targetToFollow3;

 // public Vector3 offset;//stores 3 float number for third person view
public float left = 1f;
public float right = 1f;

public float down = 1f;
public float up = 1f;
/*
public float left1 = 1f;
public float right1 = 1f;

public float down1 = 1f;
public float up1 = 1f;

public float left2 = 1f;
public float right2 = 1f;

public float down2 = 1f;
public float up2 = 1f;
*/


    // Update is called once per frame
    void Update()
    {
   //   transform.position = targetToFollow.position + offset;
    
    transform.position = new Vector3
        (
            Mathf.Clamp(targetToFollow.position.x, left, right),
            Mathf.Clamp(targetToFollow.position.y, down, up),
            transform.position.z);
    /*
     transform.position = new Vector3
       (
            Mathf.Clamp(targetToFollow2.position.x, left1, right1),
            Mathf.Clamp(targetToFollow2.position.y, down1, up1),
            transform.position.z);

             transform.position = new Vector3
        (
            Mathf.Clamp(targetToFollow3.position.x, left2, right2),
            Mathf.Clamp(targetToFollow3.position.y, down2, up2),
            transform.position.z);
    }*/
    
}
}