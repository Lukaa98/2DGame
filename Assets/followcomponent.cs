using UnityEngine;

public class followcomponent : MonoBehaviour
{
  public Transform targetToFollow;
 // public Vector3 offset;//stores 3 float number for third person view
public float left = 1f;
public float right = 1f;

public float down = 1f;
public float up = 1f;


    // Update is called once per frame
    void Update()
    {
   //   transform.position = targetToFollow.position + offset;
    
    transform.position = new Vector3
        (
            Mathf.Clamp(targetToFollow.position.x, left, right),
            Mathf.Clamp(targetToFollow.position.y, down, up),
            transform.position.z);
    }
}